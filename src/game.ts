import Player from './player';
import { setupBoardUI } from './components/interface';

function startGame(vsComputer:boolean, playerNames:string[]) {
    const p1 = new Player(playerNames[0]);
    let p2:Player;

    vsComputer?
    p2 = new Player('Fleet Admiral Bot'):
    p2 = new Player(playerNames[1]);

    setupBoardUI(p1.name);
    setupBoardUI(p2.name);
}

export { startGame }
