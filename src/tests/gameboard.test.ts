import { expect, it, describe } from "vitest";
import GameBoard from "../gameboard";
import { setupBoard } from "../gameboard";
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
describe('Seek Placement (single ship)', () => {
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

describe('Marking ship characters on board', () => {
    it('vertical battleship(4) on coordinates 7-4 should be equal to modified board.', () => {
        const modifiedBoard = setupBoard();
        modifiedBoard[7][4] = 'b';
        modifiedBoard[8][4] = 'b';
        modifiedBoard[9][4] = 'b';
        modifiedBoard[10][4] = 'b';

        const gameBoard = new GameBoard();
        const battleship = new Ship(4);
        gameBoard.placeShip(battleship, '7-4', 'b');

        expect(gameBoard.getBoard()).toEqual(modifiedBoard);
    });

    it('horizontal destroyer(2) on coordinates 8-7 and vertical submarine(3) on coordinates 2-3 should be equal to modified board.', () => {
        const modifiedBoard = setupBoard();
        modifiedBoard[8][7] = 'd';
        modifiedBoard[8][8] = 'd';
        modifiedBoard[2][3] = 's';
        modifiedBoard[3][3] = 's';
        modifiedBoard[4][3] = 's';

        const gameBoard = new GameBoard();
        const destroyer = new Ship(2);
        destroyer.toggleDirection();
        const submarine = new Ship(3);
        gameBoard.placeShip(destroyer, '8-7', 'd');
        gameBoard.placeShip(submarine, '2-3', 's');

        expect(gameBoard.getBoard()).toEqual(modifiedBoard);
    });

    it('horizontal cruiser(3) on coordinates 3-3 will not be marked on board after placing vertical battleship(4) on coordinates 2-5', () => {
        const modifiedBoard = setupBoard();
        modifiedBoard[2][5] = 'b';
        modifiedBoard[3][5] = 'b';
        modifiedBoard[4][5] = 'b';
        modifiedBoard[5][5] = 'b';

        const gameBoard = new GameBoard();
        const battleship = new Ship(4);
        const cruiser = new Ship(3);
        cruiser.toggleDirection();
        gameBoard.placeShip(battleship, '2-5', 'b');
        gameBoard.placeShip(cruiser, '3-3', 'r');

        expect(gameBoard.getBoard()).toEqual(modifiedBoard);
    });
});
