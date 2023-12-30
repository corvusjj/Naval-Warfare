import { userMethods } from './game';
import { 
    toggleBoardUI,
    markSquareUI,
} from './components/interface/gameInterface';

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
        toggleBoardUI(index);
    },

    markSquareInterface(square: number[], name: string) {
        markSquareUI(square, name)
    }
}

export {
    gameOperations,
    interfaceOperations
}