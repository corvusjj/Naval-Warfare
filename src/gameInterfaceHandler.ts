import { interfaceMethods } from './components/interface/gameInterface';
import { userMethods } from './game';

const interfaceOperations = {
    toggleBoardInterface(index: number) {
        interfaceMethods.toggleBoardUI(index);
    },

    markSquareInterface(square: number[], boardId: string, state:string) {
        interfaceMethods.markSquareUI(square, boardId, state);
    },

    setPanelUiToActive() {
        interfaceMethods.setBoardPanelToActive();
    },

    animateHitByComputer() {
        interfaceMethods.animateHitByComputer();
    },

    handleSunkShip(defenderId:string, shipKey:string, coordinates:number[][]) {
        interfaceMethods.handleSunkShip(defenderId, shipKey, coordinates);
    },

    handleGameOver(winnerName:string, attackerId:string) {
        interfaceMethods.handleGameOver(winnerName, attackerId);
    }
}

const gameOperations = {
    setGameState(vsComputer:boolean, playerNames:string[]) {
        userMethods.setGameState(vsComputer, playerNames);
    },

    getPlayersData() {
        return userMethods.playersData();
    },

    placeFirstPlayerShip: (key:string, isVertical:boolean, coord:string) => {
        userMethods.placeFirstPlayerShip(key, isVertical, coord);
    },

    placeSecondPlayerShip: (key:string, isVertical:boolean, coord:string) => {
        userMethods.placeSecondPlayerShip(key , isVertical , coord);
    },
    
    attack(square: number[], vsComputerTurn:boolean) {
        userMethods.attack(square, vsComputerTurn);
    },

    getState() {
        return userMethods.getState();
    }
}

export {
    interfaceOperations, gameOperations
}
