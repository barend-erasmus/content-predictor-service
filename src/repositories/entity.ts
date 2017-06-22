// Imports models
import { Word } from './../models/word';
import { Entity } from './../models/entity';

export interface IEntityRepository {

    find(id: string): Promise<Entity>;

    insert(entity: Entity): Promise<boolean>;

    save(entity: Entity): Promise<boolean>;
}