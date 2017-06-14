// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';
import * as co from 'co';

// Imports models
import { Word } from './../models/word';

// Imports repositories
import { DataRepository } from './../repositories/data';

// Imports services
import { PredictorService } from './../services/predictor';

export class PredictorRouter {

    public static train(req: Request, res: Response, next: () => void) {
        co(function* () {
            const dataRepository: DataRepository = new DataRepository();
            const predictorService = new PredictorService(dataRepository);

            if (req.body.type === 'liked') {
                yield predictorService.addLikedDocument(req.body.id, req.body.html);
            } else if (req.body.type === 'disliked') {
                yield predictorService.addDislikedDocument(req.body.id, req.body.html);
            } else {
                throw new Error('invalid type');
            }

            res.send('OK');
        });
    }

    public static predict(req: Request, res: Response, next: () => void) {
        co(function* () {
            const dataRepository: DataRepository = new DataRepository();
            const predictorService = new PredictorService(dataRepository);

            const words: Word[] = predictorService.toWords(req.body.html);

            const result: boolean = yield predictorService.calculatePerdiction(req.body.id, words);

            res.send(result ? 'like' : 'dislike');
        });
    }

}
