import { userMethods } from "../game";

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
const boardsPanel = document.querySelector('.boards-panel') as HTMLElement;

function setupBoardUI (name:string) {
    const board = document.createElement('div');
    board.classList.add('board');
    board.classList.add(name);

    const letterAxis = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const x = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const y = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    let xIndex = 0;
    let yIndex = 0;

    (function firstRow() {
        for(let i = 0; i < 11; i++) {
            const square = document.createElement('div');
            square.textContent = letterAxis[i];
            square.classList.add('square');
            square.classList.add('square-axis');
            square.style.borderLeft = 'none';
            board.appendChild(square);
        }
    })();

    for(let i = 0; i < 110; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.style.borderTop = 'none';
        board.appendChild(square);

        if (xIndex === 0) {
            square.classList.add('square-axis');
            square.textContent = `${y[yIndex]}`;
        } else {
            square.style.borderLeft = 'none';
            square.setAttribute('data-coord', `${y[yIndex]}-${x[xIndex]}`);
            square.addEventListener('click', attack);
        }

        xIndex++;
        
        if (xIndex > 10) {
            xIndex = 0;
            yIndex++;
        }
    }

    board.setAttribute('data-index', `${boardsPanel.childElementCount}`);
    boardsPanel.appendChild(board);
}

function toggleBoardUI(index: number) {
    index === 0?
    boardsPanel.classList.remove('toggle-panel'):
    boardsPanel.classList.add('toggle-panel');
}

function attack(e: MouseEvent) {
    const squareNode = e.target as HTMLDivElement;
    const stringCoord = squareNode.dataset.coord!;
    const coordinates = stringCoord.split('-');

    userMethods.attack(coordinates.map(x => parseInt(x)));
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
        userMethods.setGameState(false, ['john', 'nathan']);
        setupBoardUI('nathan');
        setupBoardUI('john');
    }   
});

export { 
    toggleBoardUI,
    markSquareUI
}
