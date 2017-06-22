// Imports
import { expect } from 'chai';
import * as co from 'co';
import 'mocha';
import * as sinon from 'sinon';

// Imports services
import { PredictorService } from './predictor';

// Imports repositories
import { EntityRepository } from './../repositories/mock/entity';

// Imports domain models
import { Entity } from './../models/entity';
import { Word } from './../models/word';

describe('PredictorService', () => {

    describe('toWords', () => {

        let predictorService: PredictorService = null;

        beforeEach(() => {
            
            predictorService = new PredictorService(null);
        });

        it('should return list of words with frequency', () => {

            return co(function*() {
                const result: Word[] = predictorService.toWords('<p>Hello World.</p><p>I wonder if the world would reply?</p>')
                
                expect(result.length).to.be.eq(4);
                expect(result[0].value).to.be.eq('hello');
                expect(result[1].value).to.be.eq('world');
                expect(result[2].value).to.be.eq('wonder');
                expect(result[3].value).to.be.eq('reply');

                expect(result[0].frequency).to.be.eq(1);
                expect(result[1].frequency).to.be.eq(2);
                expect(result[2].frequency).to.be.eq(1);
                expect(result[3].frequency).to.be.eq(1);
            });
        });
    });

    describe('joinWords', () => {

        let predictorService: PredictorService = null;

        beforeEach(() => {
            
            predictorService = new PredictorService(null);
        });

        it('should return list of words with combined frequency', () => {

            return co(function*() {
                const result: Word[] = predictorService.joinWords(
                    [
                        new Word('hello', 1),
                        new Word('world', 3)
                    ],
                    [
                        new Word('hello', 1),
                        new Word('stuff', 5)
                    ]
                );
                
                expect(result.length).to.be.eq(3);
                expect(result[0].value).to.be.eq('hello');
                expect(result[1].value).to.be.eq('world');
                expect(result[2].value).to.be.eq('stuff');

                expect(result[0].frequency).to.be.eq(2);
                expect(result[1].frequency).to.be.eq(3);
                expect(result[2].frequency).to.be.eq(5);
            });
        });
    });
});