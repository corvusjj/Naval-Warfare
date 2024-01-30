import { interfaceMethods } from './components/interface/gameInterface';
import { userMethods } from './game';

const interfaceOperations = {
    toggleBoardInterface(index: number) {
        interfaceMethods.toggleBoardUI(index);
    },

    markSquareInterface(square: number[], boardId: string, state:string) {
        interfaceMethods.markSquareUI(square, boardId, state);
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
    
    attack(square: number[]) {
        userMethods.attack(square);
    },

    getState() {
        return userMethods.getState();
    }
}

export {
    interfaceOperations, gameOperations
}
