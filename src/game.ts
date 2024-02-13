import Player from './gameTemplates/player';
import AiPlayer from './gameTemplates/aiPlayer';
import { interfaceOperations } from './gameInterfaceHandler';
import { runActivateAudio, runAttackAudio, squareHitEffect, handleGameOverAudio } from './utilities/controlPanel';

interface attackState {
    state: string;
    coordinates: number[][];
    squareKey: string;
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

function playHitEffects() {
    if (!gameState.vsComputer) {
        squareHitEffect.runOptimal();
    } else {
        if (gameState.attacker === gameState.p2) {
            squareHitEffect.runAlert();
            setTimeout(() => void interfaceOperations.animateHitByComputer(), 200);
        } else {
            squareHitEffect.runOptimal();
        }
    }
}

function reportSunkShip(shipKey:string, coordinates:number[][]) {
    const defenderId:string = gameState.defender.id;
    interfaceOperations.handleSunkShip(defenderId, shipKey, coordinates);
}

function gameOver(winnerName:string, attackerId:string) {
    interfaceOperations.handleGameOver(winnerName, attackerId);
    handleGameOverAudio();
}

const aiHandler = {
    attack: () => {
        if (gameState.p2 instanceof AiPlayer) {
            const coord:number[] = gameState.p2.chooseTarget();
            setTimeout(() => userMethods.attack(coord, true), 1200);
        }
    },

    updateAttackState: (attackState:attackState) => {
        if (gameState.p2 instanceof AiPlayer) {
            gameState.p2.handleAttackState(attackState);
        }
    }
}

const userMethods = {
    setGameState: (vsComputer:boolean, playerNames:string[]) => {
        const p1 = new Player(playerNames[0]);
        let p2: Player | AiPlayer;
    
        vsComputer?
        p2 = new AiPlayer(playerNames[1]):
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

    attack(square: number[], vsComputerTurn:boolean) {
        const attackState:attackState = gameState.attack(square);
        const state = attackState.state;
        interfaceOperations.markSquareInterface(square, gameState.defender.id, state);

        runActivateAudio();
        setTimeout(() => { runAttackAudio(state) }, 500);

        //  -------------   AI BLOCK   --------------
        if (vsComputerTurn) aiHandler.updateAttackState(attackState);

        if (state !== 'miss') {
            setTimeout(() => playHitEffects(), 300);
            setTimeout(() => interfaceOperations.setPanelUiToActive(), 600);

            if (state === 'sunk' || state === 'game-over') reportSunkShip(attackState.squareKey, attackState.coordinates);
            if (state === 'game-over') return gameOver(gameState.attacker.name, gameState.attacker.id);

            //  -------------   AI BLOCK   --------------
            if (vsComputerTurn) setTimeout(() => aiHandler.attack(), 700);
        } else {
            setTimeout(() => interfaceOperations.setPanelUiToActive(), 1200);
            setTimeout(() => { nextPlayerTurn() }, 1200);
        }
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
    aiHandler.attack();
}

export { userMethods }
