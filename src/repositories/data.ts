// Imports
import * as co from 'co';
import * as store from 'data-store';

// Imports models
import { Word } from './../models/word';
import { Entity } from './../models/entity';

export class DataRepository {

    public find(id: string): Promise<Entity> {
        return new Promise((resolve, reject) => {
            resolve(store('app', {
                cwd: './db'
            }).get('entity'));
        });
    }

    public insert(entity: Entity): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(store('app', {
                cwd: './db'
            }).set('entity', entity));
        });
    }

    public save(entity: Entity): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(store('app', {
                cwd: './db'
            }).set('entity', entity));
        });
    }

}