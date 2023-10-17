import Player from './player';
import { 
    toggleBoardUI,
} from './components/interface';
interface attackState {
    state: string;
    coordinates: number[][];
}


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
        return this.attacker.attack(square, this.defender);
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
    },

    attack: (square: number[]) => {
        const attackState:attackState = gameState.attack(square);
        console.log(attackState);
        gameState.toggleState();
    }
}

export { userMethods }
