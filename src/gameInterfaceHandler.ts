import { userMethods } from './game';
import { interfaceMethods } from './components/interface/gameInterface';

const gameOperations = {
    setGameState(vsComputer:boolean, playerNames:string[]) {
        userMethods.setGameState(vsComputer, playerNames);
    },

    getPlayersData() {
        return userMethods.playersData();
    },
    
    attack(square: number[]) {
        userMethods.attack(square);
    }
}

const interfaceOperations = {
    toggleBoardInterface(index: number) {
        interfaceMethods.toggleBoardUI(index);
    },

    markSquareInterface(square: number[], id: string) {
        interfaceMethods.markSquareUI(square, id)
    }
}

export {
    gameOperations,
    interfaceOperations
}