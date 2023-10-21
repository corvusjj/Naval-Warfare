import Player from './player';
import setupAllCoordinates from "../utilities/coordinatesGenerator";

export default class AiPlayer extends Player {
    enemySquares: number[][];

    constructor(name:string) {
        super(name);
        this.enemySquares = setupAllCoordinates();
    }

    chooseSquare() {
        return this.enemySquares[3];
    }
}