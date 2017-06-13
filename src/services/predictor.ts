// Imports
import * as co from 'co';
import * as sw from 'stopword';

// Imports models
import { Entity } from './../models/entity';
import { Word } from './../models/word';

// Imports repositories
import { DataRepository } from './../repositories/data';

export class PredictorService {

    constructor(private dataRepository: DataRepository) {

    }

    public toWords(html: string): Word[] {

        const wordStrings: string[] = sw.removeStopwords(
            html.replace(/<(?:.|\n)*?>/gm, '').replace(/[^a-zA-Z ]/g, ' ')
                .split(' ')
        ).filter((x) => x !== '' && x !== ' ').map((x) => x.toLowerCase());

        const uniqueWordStrings: string[] = wordStrings.filter((item: string, pos: number) => {
            return wordStrings.indexOf(item) === pos;
        });

        const words: Word[] = [];

        for (const word of uniqueWordStrings) {
            const count: number = wordStrings.filter((x) => x === word).length;

            words.push(new Word(word, count));
        }

        return words;
    }

    public joinWords(a: Word[], b: Word[]): Word[] {
        const result: Word[] = [];

        const ab = a.map((x) => x.value).concat(b.map((x) => x.value));
        const uniqueWords: string[] = ab.filter((item: string, pos: number) => {
            return ab.indexOf(item) === pos;
        });

        for (const s of uniqueWords) {
            const wordA: Word = a.find((x) => x.value === s);
            const wordB: Word = b.find((x) => x.value === s);

            if (wordA && wordB) {
                result.push(new Word(wordA.value, wordA.frequency + wordB.frequency));
            } else if (wordA) {
                result.push(wordA);
            } else if (wordB) {
                result.push(wordB);
            }
        }

        return result;
    }

    public calculatePerdiction(id: string, words: Word[]): Promise<true> {
        const self = this;
        return co(function* () {
            const entity: Entity = yield self.dataRepository.find(id);

            const uniqueWords: Word[] = words.filter((item: Word, pos: number) => {
                return words.indexOf(item) === pos;
            });


            // Liked
            let chanceBeingLiked = 1;

            for (const word of uniqueWords) {

                const numberOfTimesWordLiked = entity.likedWords.find((x) => x.value === word.value) ? entity.likedWords.find((x) => x.value === word.value).frequency : null;
                const numberOfTimesWordDisliked = entity.dislikedWords.find((x) => x.value === word.value) ? entity.dislikedWords.find((x) => x.value === word.value).frequency : null;

                const p1 = numberOfTimesWordLiked / entity.likedWords.length;

                const p2 = entity.likedWords.length / (entity.likedWords.length + entity.dislikedWords.length);

                const p3 = (numberOfTimesWordLiked + numberOfTimesWordDisliked) / (entity.likedWords.length + entity.dislikedWords.length);

                let p = p1 * p2 / p3;

                if (isNaN(p)) {
                    p = 0.5;
                }

                if (p === 0) {
                    p = 0.5;
                }

                chanceBeingLiked *= p;
            }

            // Disliked

            let chanceBeingDisliked = 1;

            for (const word of uniqueWords) {

                const numberOfTimesWordLiked = entity.likedWords.find((x) => x.value === word.value) ? entity.likedWords.find((x) => x.value === word.value).frequency : null;
                const numberOfTimesWordDisliked = entity.dislikedWords.find((x) => x.value === word.value) ? entity.dislikedWords.find((x) => x.value === word.value).frequency : null;

                const p1 = numberOfTimesWordDisliked / entity.dislikedWords.length;

                const p2 = entity.dislikedWords.length / (entity.dislikedWords.length + entity.likedWords.length);

                const p3 = (numberOfTimesWordDisliked + numberOfTimesWordLiked) / (entity.dislikedWords.length + entity.likedWords.length);

                let p = p1 * p2 / p3;

                if (isNaN(p)) {
                    p = 0.5;
                }

                if (p === 0) {
                    p = 0.5;
                }

                chanceBeingDisliked *= p;
            }

            console.log(chanceBeingLiked);
            console.log(chanceBeingDisliked);
            return Math.max(chanceBeingLiked, chanceBeingDisliked) === chanceBeingLiked;
        });
    }

    public addLikedDocument(id: string, html: string): Promise<boolean> {
        const self = this;
        return co(function* () {
            const entity: Entity = yield self.dataRepository.find(id);

            if (!entity) {
                const result = yield self.dataRepository.save(new Entity(id, self.toWords(html), []));
                return result;
            } else {

                entity.likedWords = self.joinWords(entity.likedWords, self.toWords(html));

                const result = yield self.dataRepository.save(entity);
                return result;
            }
        });
    }

    public addDislikedDocument(id: string, html: string): Promise<boolean> {
        const self = this;
        return co(function* () {
            const entity: Entity = yield self.dataRepository.find(id);

            if (!entity) {
                const result = yield self.dataRepository.save(new Entity(id, [], self.toWords(html)));
                return result;
            } else {

                entity.dislikedWords = self.joinWords(entity.dislikedWords, self.toWords(html));

                const result = yield self.dataRepository.save(entity);
                return result;
            }
        });
    }
}