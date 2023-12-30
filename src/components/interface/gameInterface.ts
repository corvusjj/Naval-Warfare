import { gameOperations } from '../../gameInterfaceHandler';
import generateBoard from '../../utilities/battleshipBoardInterface';

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const boardsPanel = document.querySelector('.boards-panel') as HTMLElement;
let board1;HTMLDivElement
let board2:HTMLDivElement;

function setupBoardGame(p1Name: string, p2Name: string) {
    // boardsPanel.innerHTML = '';

    board1 = generateBoard(p1Name);
    board2 = generateBoard(p2Name);

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

    markSquareUI: (square: number[], name: string) => {
        const [x, y] = square.map(num => num.toString());
        const board = document.querySelector(`.${name}`)!;
        const tileUI = board.querySelector(`[data-coord="${x}-${y}"]`)!;
        tileUI.textContent = 'X';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        gameOperations.setGameState(false, ['john', 'Fleet_Admiral_Bot']);
        const playersData = gameOperations.getPlayersData();

        setupBoardGame('john', 'Fleet_Admiral_Bot');
        interfaceMethods.toggleBoardUI(1);  // player 2 attacker as default
    }
});

export { interfaceMethods }
