import GameBoard from "./gameboard";
import Ship from "./ship";
type playerShips = Record<string, Ship>;

function setupShips() {
    return {
        c: new Ship(5),  // carrier
        b: new Ship(4),  // battleship
        r: new Ship(3),  // cruiser
        s: new Ship(3),  // submarines
        d: new Ship(2)   // destroyer 
    }
}

export default class Player {
    gameBoard: GameBoard;
    ships: playerShips;
    name: string;

    constructor(name:string) {
        this.name = name;
        this.gameBoard = new GameBoard;
        this.ships = setupShips();
    }

    receiveAttack(square:number[]) {
        this.gameBoard.receiveAttack(square);
    }

    attack(square:number[], opponent:Player) {
        opponent.receiveAttack(square);
    }
}
