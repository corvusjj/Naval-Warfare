import Player from './player';
import setupAllCoordinates from "../utilities/battleshipCoordinates";
import { coordinateSeeker } from '../utilities/coordinatesHandler';

interface attackState {
    state: string;
    coordinates: number[][];
}

//  every time the computer selects a focusedTarget, this object will be responsible for the
//  checkPlacement method in both y and x axis from the enemy ships' minimum length. Will reset 
//  on the the next focused target.
class Seeker {
    focusedTarget: number[];
    directions: string[];
    currentDirection: string;

    constructor() {
        this.focusedTarget = [];
        this.directions = ['vertical', 'horizontal'];
        this.currentDirection = '';
    }

    setCurrentDirection(direction:string) {
        const directionIndex = this.directions.indexOf(direction);
        this.directions.splice(directionIndex, 1);
        this.currentDirection = direction;
    }

    setRandomDirection() {
        Math.random() < 0.5?
        this.setCurrentDirection(this.directions[0]): 
        this.setCurrentDirection(this.directions[1]);
    }

    reset() {
        this.focusedTarget = [];
        this.directions = ['vertical', 'horizontal'];
        this.currentDirection = '';
    }
}

export default class AiPlayer extends Player {
    enemySquares: number[][];
    squaresInDiagonal: number[][];
    hitQueue: number[][];
    enemyShipLengths: number[];
    seeker: Seeker;

    constructor(name:string) {
        super(name);
        this.enemySquares = setupAllCoordinates();
        this.squaresInDiagonal = this.getDiagonalCoordinates();

        this.hitQueue = [];
        this.enemyShipLengths = [5, 4, 3, 3, 2];
        this.seeker = new Seeker;
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
        if (state === 'sunk') {
            coordinates.forEach(coord => {
                const hitIndex = this.hitQueue.findIndex(hitSquare => hitSquare.toString() === coord.toString());
                if (hitIndex === -1) return;
                this.hitQueue.splice(hitIndex, 1);
            });

            const lengthIndex = this.enemyShipLengths.findIndex(length => length === coordinates.length);
            this.enemyShipLengths.splice(lengthIndex, 1);
        }
    }

    removeCoordinate(coord:number[]) {
        const diagonalRandomIndex = this.squaresInDiagonal.findIndex(square => square.toString() === coord.toString());
        if (diagonalRandomIndex !== -1) this.squaresInDiagonal.splice(diagonalRandomIndex, 1);

        const enemySquareIndex = this.enemySquares.findIndex(square => square.toString() === coord.toString());
        this.enemySquares.splice(enemySquareIndex, 1);
    }

    coordInHitQueue(coordinates:number[]) {
        return this.hitQueue.some(arr => {
            return arr.every((val, index) => arr.length === coordinates.length && val === coordinates[index]);
        });
    }

    coordNotAttacked(coordinates: number[]) {
        return this.enemySquares.some(arr => {
            return arr.every((val, index) => arr.length === coordinates.length && val === coordinates[index]);
        });
    }

    getVerticalAndHorizontalTargetStates(damagedTarget:boolean) {
        let verticalSquareStates: string[];
        let horizontalSquareStates: string[];

        if (damagedTarget) {
            verticalSquareStates = ['origin-hit'];
            horizontalSquareStates = ['origin-hit'];
        } else {
            verticalSquareStates = ['free'];
            horizontalSquareStates = ['free'];
        }

        function placeSquareState(direction:string, state:string) {
            switch (direction) {
                case 'top':
                    verticalSquareStates.unshift(state);
                    break;
                case 'right':
                    horizontalSquareStates.push(state);
                    break;
                case 'bottom':
                    verticalSquareStates.push(state);
                    break;
                case 'left':
                    horizontalSquareStates.unshift(state);
                    break;
            }
        }

        const originSquare = this.seeker.focusedTarget;
        const maxEnemyShip = this.enemyShipLengths[0];        
        const directions = ['top', 'right', 'bottom', 'left'];
        let squareSpan = 1;

        //  increment seekSquare span / current level order 
        for (squareSpan; squareSpan < maxEnemyShip; squareSpan++) {
            let dirIndex = 0;

            //  seek squares on all 4 directions in current level order / span.
            while (dirIndex < directions.length) {
                const [x, y] = coordinateSeeker(originSquare, directions[dirIndex], squareSpan);

                //  if square over the board, skip the direction.
                if ((x < 1 || x > 10) || (y < 1 || y > 10)) {
                    directions.splice(dirIndex, 1);
                    continue;
                }

                //  if square is already attacked but not in hitQueue, skip the direction.
                if (!this.coordNotAttacked([x, y]) && !this.coordInHitQueue([x, y])) {
                    directions.splice(dirIndex, 1);
                    continue;
                }

                this.coordInHitQueue([x, y])?
                placeSquareState(directions[dirIndex], 'hit'):
                placeSquareState(directions[dirIndex], 'free');

                dirIndex++;
            }
        }

        return [verticalSquareStates, horizontalSquareStates];
    }

    //  will return =>
    //      false: both directions are impossible
    //      null: both are possible && no hits
    //      string[]: only one is possible || both are possible but one has hits
    checkPlacement(verticalSquares:string[], horizontalSquares:string[]) {
        const probableDirection = [verticalSquares, horizontalSquares];

        //  check for length
        if (verticalSquares.length < this.enemyShipLengths[this.enemyShipLengths.length - 1]) probableDirection.splice(0, 1);
        if (horizontalSquares.length < this.enemyShipLengths[this.enemyShipLengths.length - 1]) probableDirection.splice(1, 1);

        if (probableDirection.length === 0) return false;
        if (probableDirection.length === 1) return probableDirection[0];

        //  if it can be placed on both directions, now check for successive hits.
        const verticalHits = verticalSquares.filter(state => state === 'hit').length;
        const horizontalHits = horizontalSquares.filter(state => state === 'hit').length;

        if (verticalHits === horizontalHits) return null;
        return verticalHits > horizontalHits? probableDirection[0]: probableDirection[1];
    }

    damagedShipTargetPursuit(
        verticalSquares:string[], 
        horizontalSquares:string[], 
        probableDirection: false | string[] | null) {

        const directions = [verticalSquares, horizontalSquares];
        let currentDirection:string[] = [];

        if (probableDirection !== null) {
            probableDirection === verticalSquares? currentDirection = directions[0]: currentDirection = directions[1];
        } else {
            Math.random() < 0.5? currentDirection = directions[0]: currentDirection = directions[1];
        }

        let originHitIndex = 0;

        function seekBehind(spanIndex:number) {
            const currentIndex = originHitIndex - spanIndex;
            const state:string = currentDirection[currentIndex];

            if (currentIndex < 0) return undefined;
            if (state === 'free') return spanIndex;

            return seekBehind(spanIndex + 1);
        }

        function seekFront(spanIndex:number) {
            const currentIndex = originHitIndex + spanIndex;
            const state:string = currentDirection[currentIndex];

            if (currentIndex >= currentDirection.length) return undefined;
            if (state === 'free') return spanIndex;

            return seekFront(spanIndex + 1);
        }

        type seekCoordParams = [number[], string, number];

        const seekNextTarget = (): seekCoordParams => {
            originHitIndex = currentDirection.findIndex(state => state === 'origin-hit');

            const focusedTarget:number[] = this.seeker.focusedTarget;
            let direction = '';
            let span = 0;

            let linearDirections:string[];

            currentDirection === verticalSquares?
            linearDirections = ['top', 'bottom']:
            linearDirections = ['left', 'right'];

            const spansBehind = seekBehind(1);
            const spansFront = seekFront(1);

            if (spansBehind !== undefined && spansFront !== undefined) {
                if (Math.random() < 0.5) {
                    span = spansBehind;
                    direction = linearDirections[0];
                } else {
                    span = spansFront;
                    direction = linearDirections[1];
                }
            } else if (spansBehind !== undefined) {
                span = spansBehind;
                direction = linearDirections[0];
            } else if (spansFront !== undefined) {
                span = spansFront;
                direction = linearDirections[1];
            } else {
                currentDirection === directions[0]? currentDirection = directions[1]: currentDirection = directions[0];
                return seekNextTarget() as seekCoordParams;
            }

            const seekCoordParams:seekCoordParams = [focusedTarget, direction, span];
            return seekCoordParams;
        }

        const params = seekNextTarget() as seekCoordParams;
        const nextTarget:number[] = coordinateSeeker(...params);
        return nextTarget;
    }

    damagedTargetFinder():number[] {
        this.seeker.focusedTarget = this.hitQueue[0];
        const [verticalSquareStates, horizontalSquareStates] = this.getVerticalAndHorizontalTargetStates(true);

        const probableDirection: false | string[] | null = this.checkPlacement(verticalSquareStates, horizontalSquareStates);
        const target:number[] =  this.damagedShipTargetPursuit(verticalSquareStates, horizontalSquareStates, probableDirection)!;
        this.removeCoordinate(target);

        return target;
    }

    randomTargetFinder():number[] {
        const remainingDiagonalSquares = this.squaresInDiagonal.length;
        const diagonalRandomIndex = Math.round(Math.random() * (remainingDiagonalSquares - 1));
        const target = this.squaresInDiagonal[diagonalRandomIndex];

        this.seeker.focusedTarget = target;
        this.removeCoordinate(target);

        const [verticalSquareStates, horizontalSquareStates] = this.getVerticalAndHorizontalTargetStates(false);
        const canBePlaced: false | string[] | null = this.checkPlacement(verticalSquareStates, horizontalSquareStates);
        if (canBePlaced === false) return this.randomTargetFinder();

        return target;
    }

    chooseTarget() {
        this.seeker.reset();
        let chosenTarget: number[] = [];

        this.hitQueue.length > 0?
        chosenTarget = this.damagedTargetFinder(): 
        chosenTarget = this.randomTargetFinder();

        return chosenTarget;        
    }
}

//  detect adjacentHit
//  checkPlacement for random hits
//  check successiveHits length
