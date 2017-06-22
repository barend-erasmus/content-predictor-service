// Imports
import * as co from 'co';
import * as store from 'data-store';

// Imports interfaces
import { IEntityRepository } from './../entity';
 
// Imports models
import { Word } from './../../models/word';
import { Entity } from './../../models/entity';

export class EntityRepository implements IEntityRepository {

    public find(id: string): Promise<Entity> {
        return new Promise((resolve, reject) => {
            resolve(this.getStore(id).get('entity'));
        });
    }

    public insert(entity: Entity): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(this.getStore(entity.id).set('entity', entity));
        });
    }

    public save(entity: Entity): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(this.getStore(entity.id).set('entity', entity));
        });
    }

    private getStore(id: string): any {
        return store(`entity-${id}`, {
            cwd: './db'
        });
    }

}