import Player from './player';
import setupAllCoordinates from "../utilities/battleshipCoordinates";

interface attackState {
    state: string;
    coordinates: number[][];
}

export default class AiPlayer extends Player {
    enemySquares: number[][];
    squaresInDiagonal: number[][];
    hitQueue: number[][];

    constructor(name:string) {
        super(name);
        this.enemySquares = setupAllCoordinates();
        this.squaresInDiagonal = this.getDiagonalCoordinates();
        this.hitQueue = [];
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

    handleAttackState({ state, coordinates }:attackState) {
        if (state === 'hit') this.hitQueue.push(...coordinates);
    }

    removeCoordinate(diagonalRandomIndex:number, targetedSquare:number[]) {
        this.squaresInDiagonal.splice(diagonalRandomIndex, 1);

        const x = (targetedSquare[0] - 1) * 10;
        const y = targetedSquare[1] - 1;
        this.enemySquares.splice((x + y), 1);
    }

    chooseTarget() {
        const remainingDiagonalSquares = this.squaresInDiagonal.length;
        const diagonalRandomIndex = Math.round(Math.random() * (remainingDiagonalSquares - 1));
        const target = this.squaresInDiagonal[diagonalRandomIndex];

        this.removeCoordinate(diagonalRandomIndex, target);

        return target;
    }
}
