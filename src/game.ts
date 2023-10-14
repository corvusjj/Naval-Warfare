import Player from './player';
import { setupBoardUI } from './components/interface';

function createPlayer() {
    return new Player;
}

function startGame() {
    setupBoardUI('p1');
    setupBoardUI('p2');
}

export { startGame }
