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
        return null;
    }

    public insert(entity: Entity): Promise<boolean> {
        return null;
    }

    public save(entity: Entity): Promise<boolean> {
        return null;
    }
}