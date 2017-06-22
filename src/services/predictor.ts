// Imports
import * as co from 'co';
import * as sw from 'stopword';

// Imports models
import { Entity } from './../models/entity';
import { Word } from './../models/word';

// Imports repositories
import { IEntityRepository } from './../repositories/entity';

export class PredictorService {

    constructor(private entityRepository: IEntityRepository) {

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

    public moreLikelyToBeLiked(id: string, words: Word[]): Promise<true> {
        const self = this;
        return co(function* () {
            const entity: Entity = yield self.entityRepository.find(id);

            const uniqueWords: Word[] = words.filter((item: Word, pos: number) => {
                return words.indexOf(item) === pos;
            });

            // console.log(entity);


            if (!entity) {
                return true;
            }

            const likedAccuracy = entity.numberOfCorrectLikedPredictions / (entity.numberOfCorrectLikedPredictions + entity.numberOfCorrectDislikedPredictions);
            const dislikedAccuracy = entity.numberOfCorrectDislikedPredictions / (entity.numberOfCorrectLikedPredictions + entity.numberOfCorrectDislikedPredictions);

            console.log(`${likedAccuracy} / ${dislikedAccuracy}`);

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

            const moreLikelyToBeLikedResult: boolean = yield self.moreLikelyToBeLiked(id, self.toWords(html));

            const entity: Entity = yield self.entityRepository.find(id);

            if (!entity) {
                const result = yield self.entityRepository.save(new Entity(id, self.toWords(html), [], moreLikelyToBeLikedResult ? 1 : 0, !moreLikelyToBeLikedResult ? 1 : 0));
                return result;
            } else {

                entity.numberOfCorrectLikedPredictions += moreLikelyToBeLikedResult ? 1 : 0;
                entity.numberOfCorrectDislikedPredictions += !moreLikelyToBeLikedResult ? 1 : 0;

                entity.likedWords = self.joinWords(entity.likedWords, self.toWords(html));

                const result = yield self.entityRepository.save(entity);
                return result;
            }
        });
    }

    public addDislikedDocument(id: string, html: string): Promise<boolean> {
        const self = this;
        return co(function* () {

            const moreLikelyToBeLikedResult: boolean = yield self.moreLikelyToBeLiked(id, self.toWords(html));

            const entity: Entity = yield self.entityRepository.find(id);

            if (!entity) {
                const result = yield self.entityRepository.save(new Entity(id, self.toWords(html), [], moreLikelyToBeLikedResult ? 1 : 0, !moreLikelyToBeLikedResult ? 1 : 0));
                return result;
            } else {

                entity.numberOfCorrectLikedPredictions += moreLikelyToBeLikedResult ? 1 : 0;
                entity.numberOfCorrectDislikedPredictions += !moreLikelyToBeLikedResult ? 1 : 0;

                entity.dislikedWords = self.joinWords(entity.dislikedWords, self.toWords(html));

                const result = yield self.entityRepository.save(entity);
                return result;
            }
        });
    }
}