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



//  Algorithm for choosing a target

//  let potentialNextTarget;

//  1. get the highest and lowest length of unsunk enemy ship.
//  2. state the object 'seeker' with the properties focusedTarget and directions: [vertical, horizontal];
//      A. apply a property 'currentDirection'.
//      B. apply a method 'reset'. ( Before executing any of the number 3, this object should be reset).

//  function damagedShipTargetPursuit => should return a coordinate as potentialNextTarget based from the arguments: (direction, focusedTarget)

//  3.1. if hitQueue isn't empty, choose the first coordinate as the focusedTarget and scan 
//       each of the 4 directions (maximum squares of the highest ship length) for linear hits. 
//          A. if there's a linear hit, choose that direction and check if placement is possible with the lowest ship length.
//              a. if placement is possible, choose that direction and proceed to c.
//              b. otherwise, choose the other direction.
//              c. run damagedShipTargetPursuit and proceed to 4.
//          B. otherwise, choose a direction and check if placement is possible with the lowest ship length.
//              a. if placement is possible, choose that direction and proceed to c.
//              b. otherwise, choose the other direction.
//              c. run damagedShipTargetPursuit and proceed to 4.

//  3.2. otherwise, choose a coordinate from the diagonalCoordinates as the focusedTarget.
//          A. If a direction is available, choose one and check if placement is possible with the lowest ship length.
//              a. if placement is possible, let focusedTarget as potentialNextTarget and proceed to 4.
//              b. if not, eliminate the direction used and go back to A.
//          B. If both directions are used, eliminate all the scanned coordinates including the focusedTarget. Go back to 3.2

//  4. return potentialNextTarget;



//  figure out checkPlacement 
