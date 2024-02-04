import Player from './player';
import setupAllCoordinates from "../utilities/battleshipCoordinates";

interface attackState {
    state: string;
    coordinates: number[][];
}


export default class AiPlayer extends Player {
    enemySquares: number[][];
    squaresInDiagonal: number[][];

    constructor(name:string) {
        super(name);
        this.enemySquares = setupAllCoordinates();
        this.squaresInDiagonal = this.getDiagonalCoordinates();
    }

    getDiagonalCoordinates() {
        const coordinates:number[][] = [];

        function isOdd(num:number) {
            return num % 2 !== 0? true: false;
        }

        for (const square of this.enemySquares) {
            const x = square[0];
            const y = square[1];

            if ((isOdd(x) && isOdd(y)) || (!isOdd(x) && !isOdd(y))) {
                coordinates.push(square);
            } else {
                continue;
            }
        }

        return coordinates;
    }

    receiveAttackState({ state, coordinates }:attackState) {
        console.log(state, coordinates);
    }

    chooseTarget() {
        console.log(this.squaresInDiagonal);
        return this.enemySquares[3];
    }
}