import { userMethods } from './game';

function setGameState(vsComputer:boolean, playerNames:string[]) {
    userMethods.setGameState(vsComputer, playerNames);
}

function attack(square: number[]) {
    userMethods.attack(square);
}

export {
    setGameState,
    attack
}