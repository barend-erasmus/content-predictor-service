// Imports
import { Express, Request, Response } from "express";
import * as express from 'express';
import * as fs from 'fs';

// Imports models
import { Word } from './../models/word';

// Imports repositories
import { DataRepository } from './../repositories/data';

// Imports services
import { PredictorService } from './../services/predictor';

export class PredictorRouter {

    public static train(req: Request, res: Response, next: () => void) {
        const dataRepository: DataRepository = new DataRepository();
        const predictorService = new PredictorService(dataRepository);

        res.send('training...');
    }

    public static predict(req: Request, res: Response, next: () => void) {
        const dataRepository: DataRepository = new DataRepository();
        const predictorService = new PredictorService(dataRepository);

        res.send('predicting...');
    }

}
