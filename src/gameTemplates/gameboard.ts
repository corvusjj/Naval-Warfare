import Ship from "./ship";
import setupBoard from "../utilities/appBoardGenerator";
type playerShips = Record<string, Ship>;
type shipCoordinates = Record<string, number[][]>;

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

    hitShip(char:string, square:number[]) {
        this.ships[char].hit();

        if (this.ships[char].isSunk()) {
            return this.checkAllSunk()?
            {state: 'game-over', coordinates: this.getShipCoordinates(char)}:
            {state: 'sunk', coordinates: this.getShipCoordinates(char)};
        } else {
            return { state: 'hit', coordinates: [square] }
        }
    }

    receiveAttack(square: number[]) {
        const x = square[0];
        const y = square[1];
        const hitChar = this.board[x][y];

        if (hitChar === '.') {
            this.markBoard('o', square);
            return { state:'miss', coordinates: [[x, y]] };
        } else {
            this.markBoard('x', square);
            return this.hitShip(hitChar, [x,y]);
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
