import { userMethods } from './game';
import { 
    toggleBoardUI,
    markSquareUI,
} from './components/interface/gameInterface';

const gameInputs = {
    setGameState(vsComputer:boolean, playerNames:string[]) {
        userMethods.setGameState(vsComputer, playerNames);
    },
    
    attack(square: number[]) {
        userMethods.attack(square);
    }
}

const interfaceMethods = {
    toggleBoardInterface(index: number) {
        toggleBoardUI(index);
    },

    markSquareInterface(square: number[], name: string) {
        markSquareUI(square, name)
    }
}

export {
    gameInputs,
    interfaceMethods
}