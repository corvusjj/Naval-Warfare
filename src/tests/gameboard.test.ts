import { expect, it, describe } from "vitest";
import GameBoard from "../gameboard";
import Ship from "../ship";

const boardTemplate = [
    ['0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    ['1', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
    ['2', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
    ['3', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
    ['4', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
    ['5', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
    ['6', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
    ['7', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
    ['8', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
    ['9', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
    ['10', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.',],
]

describe('Board coordinates', () => {
    it('gameBoard instance should be equal to boardTemplate.', () => {
        const x = new GameBoard();
        expect(x.getBoard()).toEqual(boardTemplate);
    });
});

//  placing ship coordinates are arranged (up to down), (left to right) starting from initial square.
describe('Single Ship Placement', () => {
    it('vertical ship(3) on coordinates 0-3 should be true with returning coordinates [0,3], [1,3], [2,3].', () => {
        const gameBoard = new GameBoard();
        const cruiser = new Ship(3);

        expect(gameBoard.seekCoordinates(cruiser, '0-3')).toEqual(
            { canBePlaced:true, coordinates:[[0,3], [1,3], [2,3]] }
        );
    });

    it('vertical ship(5) on coordinates 8-10 should be false with returning coordinates [8,10], [9,10], [10,10].', () => {
        const gameBoard = new GameBoard();
        const carrier = new Ship(5);

        expect(gameBoard.seekCoordinates(carrier, '8-10')).toEqual(
            { canBePlaced:false, coordinates:[[8,10], [9,10], [10,10]] }
        );
    });

    it('horizontal ship(4) on coordinates 2-7 should be true with returning coordinates [2,7], [2,8], [2,9], [2,10].', () => {
        const gameBoard = new GameBoard();
        const battleship = new Ship(4);
        battleship.toggleDirection();

        expect(gameBoard.seekCoordinates(battleship, '2-7')).toEqual(
            { canBePlaced:true, coordinates:[[2,7], [2,8], [2,9], [2,10]] }
        );
    });
});
