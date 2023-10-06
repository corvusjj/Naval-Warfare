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
}
