import Ship from "./ship";

function setupBoard() {
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
    ships: object;

    constructor() {
        this.board = setupBoard();
        this.ships = {};
    }

    getBoard() {
        return [...this.board];
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
}
