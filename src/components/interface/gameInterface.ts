import { gameOperations } from '../../gameInterfaceHandler';
import generateBoard from '../../utilities/battleshipBoardInterface';
import '../style/game.scss';

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const boardsPanel = document.querySelector('.boards-panel') as HTMLElement;
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

const interfaceMethods = {
    toggleBoardUI: (index: number) => {
        index === 0?
        boardsPanel.classList.remove('toggle-panel'):
        boardsPanel.classList.add('toggle-panel');
    },

    markSquareUI: (square: number[], id: string) => {
        const [x, y] = square.map(num => num.toString());
        const board = document.querySelector(`[data-player-id="${id}"]`)!;
        const tileUI = board.querySelector(`[data-coord="${x}-${y}"]`)!;
        tileUI.textContent = 'X';
    }
}

export function initialize() {
    gameOperations.setGameState(false, ['john', 'drake']);
        
        //  display board interface
        setupBoardGame();
        console.log('hi');

        //  add each players data on html board element
        const [firstplayerData, secondPlayerData] = gameOperations.getPlayersData();
        board1.setAttribute('data-player-id', firstplayerData[1]);
        board1.setAttribute('data-player-name', firstplayerData[0]);
        board2.setAttribute('data-player-id', secondPlayerData[1]);
        board2.setAttribute('data-player-name', secondPlayerData[0]);
        interfaceMethods.toggleBoardUI(1);  // player 2 defender as default

        console.log(gameOperations.getState());
}

export { interfaceMethods }