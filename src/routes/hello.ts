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

export class HelloRouter {

    public static world(req: Request, res: Response, next: () => void) {
        const dataRepository: DataRepository = new DataRepository();
        const predictorService = new PredictorService(dataRepository);

        predictorService.calculatePerdiction('123', predictorService.toWords(fs.readFileSync('./documents/disliked.html', 'utf-8')))
        .then((result) => {
            console.log(result)
            res.send('world');
        })

        


    }

}
