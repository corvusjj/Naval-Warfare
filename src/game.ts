import Player from './gameTemplates/player';
import AiPlayer from './gameTemplates/aiPlayer';
import { interfaceOperations } from './gameInterfaceHandler';
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
        interfaceOperations.toggleBoardInterface(1): 
        interfaceOperations.toggleBoardInterface(0);
    }

    attack(square: number[]):attackState {
        return this.attacker.attack(square, this.defender);
    }
    
    //  get defender ship status
}

function initializeGameState(p1:Player, p2:Player | AiPlayer, vsComputer:boolean) {
    gameState = new GameState(p1, p2);
    gameState.vsComputer = vsComputer;
}

const userMethods = {
    setGameState: (vsComputer:boolean, playerNames:string[]) => {
        const p1 = new Player(playerNames[0]);
        let p2: Player | AiPlayer;
    
        vsComputer?
        p2 = new AiPlayer('Fleet_Admiral_Bot'):
        p2 = new Player(playerNames[1]);
        
        initializeGameState(p1, p2, vsComputer);
    },

    playersData: () => {
        const firstPlayerData = [gameState.p1.name, gameState.p1.id];
        const secondPlayerData = [gameState.p2.name, gameState.p2.id];
        return [ firstPlayerData, secondPlayerData ];
    },

    placeFirstPlayerShip: (key:string, isVertical:boolean, coord:string) => {
        const ship = gameState.p1.ships[key];
        if (!isVertical) ship.toggleDirection();

        const playerBoard = gameState.p1.gameBoard;     
        playerBoard.placeShip(ship, coord, key);
    },

    placeSecondPlayerShip: (key:string, isVertical:boolean, coord:string) => {
        const ship = gameState.p2.ships[key];
        if (!isVertical) ship.toggleDirection();

        const playerBoard = gameState.p2.gameBoard;     
        playerBoard.placeShip(ship, coord, key);
    },

    attack(square: number[]) {
        const attackState:attackState = gameState.attack(square);
        console.log(attackState, gameState.attacker);

        interfaceOperations.markSquareInterface(square, gameState.defender.id);

        setTimeout(() => {
            nextPlayerTurn();
        }, 1200);
    },

    getState: () => {
        return gameState;
    }
}

function nextPlayerTurn() {
    gameState.toggleState();

    //  -------------   AI BLOCK   --------------
    if (!gameState.vsComputer) return;
    if (gameState.attacker !== gameState.p2) return;

    if ('chooseTarget' in gameState.p2) {
        const coord:number[] = gameState.p2.chooseTarget();
        userMethods.attack(coord);
    }
}

export { userMethods }

//  playerId
//  aI choose squares
//  shipPlacement => findSunkShip() through getting length and through Player
