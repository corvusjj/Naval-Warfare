import { gameOperations } from '../../gameInterfaceHandler';
import generateBoard from '../../utilities/battleshipBoardInterface';
import { PlayersData } from './placementInterface';
import '../style/game.scss';

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const boardsPanel = document.querySelector('.boards-panel') as HTMLElement;
const p1Ships = document.querySelector<HTMLDivElement>('.p1-ships')!;
const p2Ships = document.querySelector<HTMLDivElement>('.p2-ships')!;
let board1: HTMLDivElement;
let board2: HTMLDivElement;

function setupBoardGame() {
    // boardsPanel.innerHTML = '';

    board1 = generateBoard();
    board2 = generateBoard();

    board1.setAttribute('data-index', '0');
    board2.setAttribute('data-index', '1');
    boardsPanel.appendChild(board1);
    boardsPanel.appendChild(board2);

    const squares = document.querySelectorAll('.square[data-coord]');
    squares.forEach(square => square.addEventListener('click', attack));
}

function attack(e: Event) {
    const squareNode = e.target as HTMLDivElement; 
    const stringCoord = squareNode.dataset.coord!;
    const coordinates = stringCoord.split('-');

    gameOperations.attack(coordinates.map(x => parseInt(x)));
    squareNode.style.pointerEvents = 'none';
}

function setGameState() {
    const playersDataJson = window.localStorage.getItem('battleship-players-data')!;
    const playersData:PlayersData = JSON.parse(playersDataJson) as PlayersData;

    playersData.vsComputer?
    gameOperations.setGameState(true, [playersData.players[0]]):
    gameOperations.setGameState(false, [playersData.players[0], playersData.players[1]]);
}

function getPlacementData() {
    interface Ship {
        length: number;
        hits: number;
        isVertical: boolean;
        sunk: boolean;
    }
        
    interface Board {
        board: string[][];
        ships: Record<string, Ship>;
        shipCoordinates: Record<string, number[][]>;
    }
    
    interface PlacementData {
        board: Board;
    }
    
    const boardsDataJson:string = window.localStorage.getItem('battleship-player-boards')!;
    const playerBoards:PlacementData[] = JSON.parse(boardsDataJson) as PlacementData[];

    console.log(playerBoards);
}

const interfaceMethods = {
    toggleBoardUI: (index: number) => {
        if (index === 0) {
            boardsPanel.classList.remove('toggle-panel');
            p2Ships.style.display = 'none';
            p1Ships.style.display = 'flex';
        } else {
            boardsPanel.classList.add('toggle-panel');
            p1Ships.style.display = 'none';
            p2Ships.style.display = 'flex';
        }
    },

    markSquareUI: (square: number[], id: string) => {
        const [x, y] = square.map(num => num.toString());
        const board = document.querySelector(`[data-player-id="${id}"]`)!;
        const tileUI = board.querySelector(`[data-coord="${x}-${y}"]`)!;
        tileUI.textContent = 'O';
    }
}

export function initialize() {
    setGameState();
    getPlacementData();

    //  display board interface
    setupBoardGame();
    console.log('hi');
    console.log(gameOperations.getState());

    //  add each players data on html board element
    const [firstplayerData, secondPlayerData] = gameOperations.getPlayersData();
    board1.setAttribute('data-player-id', firstplayerData[1]);
    board1.setAttribute('data-player-name', firstplayerData[0]);
    board2.setAttribute('data-player-id', secondPlayerData[1]);
    board2.setAttribute('data-player-name', secondPlayerData[0]);
    interfaceMethods.toggleBoardUI(1);  // player 2 defender as default
}

export { interfaceMethods }

//  placeShips on both game and interface
//  display p1Ships if vsPlayer