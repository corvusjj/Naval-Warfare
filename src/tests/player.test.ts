import { expect, it, describe, beforeEach } from "vitest";
import Player from "../gameTemplates/player";

let player1: Player;
let player2: Player;

beforeEach(() => {
    player1 = new Player();
    player2 = new Player();

    player2.gameBoard.placeShip(
        player2.ships.b, '1-7','b'
    );
});

it('should attack another player', () => {
    player1.attack([1,7], player2);
    
    expect(player2.gameBoard.getShipsStatus().b).toEqual({
        hits: 1,
        sunk: false
    });
});
