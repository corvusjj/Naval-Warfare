import Ship from "./ship";
type playerShips = Record<string, Ship>;
type shipCoordinates = Record<string, number[][]>;

export function setupBoard() {
    const board: string[][] = [];
    const firstRow = '0ABCDEFGHIJ';
    board.push(firstRow.split(''));

    for(let i = 1; i <= 10; i++) {
        const squares = '0..........';
        const row = squares.split('');
        row[0] = i.toString();
        board.push(row);
    }

    return board;
}

export default class GameBoard {
    private board: string[][];
    private ships: playerShips;
    private shipCoordinates: shipCoordinates;

    constructor() {
        this.board = setupBoard();
        this.ships = {};
        this.shipCoordinates = {};
    }

    reset() {
        this.board = setupBoard();
        this.ships = {};
        this.shipCoordinates = {};
    }

    gameOver() {
        return "game over";
    }

    checkAllSunk() {
        let allSunk = true;
        for (const char in this.ships) {
            if (!this.ships[char].isSunk()) {
                allSunk = false;
                break;
            }
        }
        return allSunk;
    }

    seekCoordinates(ship:Ship, square:string) {
        const length:number = ship.getLength();
        const direction:string = ship.getDirection();
        let x = parseInt(square.split('-')[0]);
        let y = parseInt(square.split('-')[1]);

        let canBePlaced  = true;    
        const coordinates = [[x,y]];

        for(let i = 1; i < length; i++) {
            direction === 'vertical'? x++: y++;
            if ( x > 10 ||
                 y > 10 ||
                this.board[x][y] !== '.') {
                canBePlaced = false;
                break;
            }
            coordinates.push([x,y]);
        }

        return {canBePlaced, coordinates};
    }

    private markBoard(char:string, square:number[]) {
        const x = square[0];
        const y = square[1];
        this.board[x][y] = char;
    }

    private setShipCoordinates(char:string, square:number[]) {
        const x = square[0];
        const y = square[1];
        this.shipCoordinates[char].push([x,y]);
    }

    placeShip(ship:Ship, square:string, char:string) {
        const seekPlacement = this.seekCoordinates(ship, square);
        if (seekPlacement.canBePlaced === false) return;

        this.shipCoordinates[char] = [];
        seekPlacement.coordinates.forEach((square:number[]) => {
            this.markBoard(char, square);
            this.setShipCoordinates(char, square);
        });

        this.ships[char] = ship;
    }

    hitShip(char:string) {
        this.ships[char].hit();

        if (this.ships[char].isSunk()) {
            if (this.checkAllSunk()) this.gameOver();
            return this.getShipCoordinates(char);
        }
    }

    receiveAttack(square: number[]) {
        const x = square[0];
        const y = square[1];
        const hitChar = this.board[x][y];

        if (hitChar === '.') {
            this.markBoard('o', square);
        } else {
            this.markBoard('x', square);
            return this.hitShip(hitChar);
        }
    }

    getShipCoordinates(char:string) {
        return this.shipCoordinates[char];
    }

    getShipsStatus() {
        type shipStatus = Record<string, {
                hits: number,
                sunk: boolean
            }>;

        const shipsStatus: shipStatus = {};

        for (const property in this.ships) {
            const ship = this.ships[property];

            shipsStatus[property] = {
                hits: ship.numOfHits(),
                sunk: ship.isSunk()
            }
        }
        
        return shipsStatus;
    }

    getBoard() {
        return [...this.board];
    }
}
