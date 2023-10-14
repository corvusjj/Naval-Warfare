const boardsPanel = document.querySelector('.boards-panel')!;

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
            square.addEventListener('click', hitSquare);
        }

        xIndex++;
        
        if (xIndex > 10) {
            xIndex = 0;
            yIndex++;
        }
    }
    boardsPanel.appendChild(board);
}

function toggleBoard() {
    boardsPanel.classList.toggle('boards-toggle');
}

function hitSquare(e: MouseEvent) {
    const square:HTMLDivElement = e.target;
    square.textContent = 'x';
    square.style.pointerEvents = 'none';
    toggleBoard();
}

export { 
    setupBoardUI,
    toggleBoard 
}

