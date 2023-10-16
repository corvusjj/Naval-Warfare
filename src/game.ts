import Player from './player';
import { 
    toggleBoardUI
} from './components/interface';

let gameState: GameState;

class GameState {
    vsComputer: boolean;
    p1: Player;
    p2: Player;
    attacker: Player;
    defender: Player;

    constructor(p1:Player, p2:Player) {
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

        this.attacker === this.p1? toggleBoardUI(0): toggleBoardUI(1);
    }

    attack(square: number[]) {
        this.attacker.attack(square, this.defender);
    }   
}

const userMethods = {
    setGameState: (vsComputer:boolean, playerNames:string[]) => {
        const p1 = new Player(playerNames[0]);
        let p2:Player;
    
        vsComputer?
        p2 = new Player('Fleet Admiral Bot'):
        p2 = new Player(playerNames[1]);
        
        gameState = new GameState(p1, p2);
        if (vsComputer) gameState.vsComputer = true;
        console.log(gameState);
    },

    attack: (square: number[]) => {
        gameState.attack(square);
    }
}

export { userMethods }
