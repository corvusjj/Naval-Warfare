import { expect, it, beforeEach } from "vitest";
import Player from "../gameTemplates/player";
import idGenerator from "../utilities/playerId";

let player1: Player;
let player2: Player;

beforeEach(() => {
    player1 = new Player('name');
    player2 = new Player('name');

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

it('amount of id-strings in idGenerator should always contain a max of 2', () => {
    idGenerator.setId();
    idGenerator.setId();
    idGenerator.setId();
    idGenerator.setId();

    expect((idGenerator.getIdUsedLength())).toBe(2);
});
