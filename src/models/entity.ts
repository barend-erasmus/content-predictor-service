// Imports models
import { Word } from './word';

export class Entity {
    constructor(public id: string, public likedWords: Word[], public dislikedWords: Word[]) {

    }
}