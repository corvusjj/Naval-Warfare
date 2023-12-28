import Player from './gameTemplates/player';
import AiPlayer from './gameTemplates/aiPlayer';
import { interfaceOperations } from './gameInterfaceHandler';
import './components/style/game.scss';
import './utilities/controlPanel';

interface attackState {
    state: string;
    coordinates: number[][];
}

let gameState: GameState;

class GameState {
    vsComputer: boolean;
    p1: Player;
    p2: Player | AiPlayer;
    attacker: Player | AiPlayer;
    defender: Player | AiPlayer;

    constructor(p1:Player, p2:Player | AiPlayer) {
        this.p1 = p1;
        this.p2 = p2;
        this.vsComputer = false;
        this.attacker = p1;
        this.defender = p2;
    }

    toggleState() {
        if (this.attacker === this.p1) {
            this.attacker = this.p2;
            this.defender = this.p1;
        } else {
            this.attacker = this.p1;
            this.defender = this.p2;
        }

        this.attacker === this.p1? 
        interfaceOperations.toggleBoardInterface(0): 
        interfaceOperations.toggleBoardInterface(1);
    }

    attack(square: number[]):attackState {
        return this.attacker.attack(square, this.defender);
    }   
}

const userMethods = {
    setGameState: (vsComputer:boolean, playerNames:string[]) => {
        const p1 = new Player(playerNames[0]);
        let p2: Player | AiPlayer;
    
        vsComputer?
        p2 = new AiPlayer('Fleet_Admiral_Bot'):
        p2 = new Player(playerNames[1]);
        
        gameState = new GameState(p1, p2);
        if (vsComputer) gameState.vsComputer = true;
    },

    attack: (square: number[]) => {
        const attackState:attackState = gameState.attack(square);
        console.log(attackState);
        interfaceOperations.markSquareInterface(square, gameState.defender.name);
        gameState.toggleState();

        if (gameState.vsComputer && gameState.attacker === gameState.p2) {
            if ('chooseSquare' in gameState.p2) {
                const coord: number[] = gameState.p2.chooseSquare();
                userMethods.attack(coord);
            }
        }
    },
}

export { userMethods }

//  computer attack
//  aI choose squares
//  shipPlacement => findSunkShip() through getting length and through Player
