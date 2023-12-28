import { gameInputs } from '../../gameInterfaceHandler';
import generateBoard from '../../utilities/uiBoardGenerator';

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const boardsPanel = document.querySelector('.boards-panel') as HTMLElement;

function setupBoardGame(p1Name: string, p2Name: string) {
    // boardsPanel.innerHTML = '';

    const board1 = generateBoard(p1Name);
    const board2 = generateBoard(p2Name);
    board1.setAttribute('data-index', '0');
    board2.setAttribute('data-index', '1');
    boardsPanel.appendChild(board1);
    boardsPanel.appendChild(board2);

    const squares = document.querySelectorAll('.square[data-coord]');
    squares.forEach(square => square.addEventListener('click', attack));
}

function toggleBoardUI(index: number) {
    index === 0?
    boardsPanel.classList.remove('toggle-panel'):
    boardsPanel.classList.add('toggle-panel');
}

function attack(e: Event) {
    const squareNode = e.target as HTMLDivElement; 
    const stringCoord = squareNode.dataset.coord!;
    const coordinates = stringCoord.split('-');

    gameInputs.attack(coordinates.map(x => parseInt(x)));
    squareNode.style.pointerEvents = 'none';
}

function markSquareUI(square: number[], name: string) {
    const [x, y] = square.map(num => num.toString());
    const board = document.querySelector(`.${name}`)!;
    const tileUI = board.querySelector(`[data-coord="${x}-${y}"]`)!;
    tileUI.textContent = 'X';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        gameInputs.setGameState(false, ['john', 'nathan']);
        setupBoardGame('nathan', 'john');
    }   
});

export { 
    toggleBoardUI,
    markSquareUI
}
