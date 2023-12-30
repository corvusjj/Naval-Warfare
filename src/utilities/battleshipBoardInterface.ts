export default function generateBoard() {
    const board = document.createElement('div');
    board.classList.add('board');

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
        }

        xIndex++;
        
        if (xIndex > 10) {
            xIndex = 0;
            yIndex++;
        }
    }
    return board;
}
