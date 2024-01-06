import generateBoard from '../../utilities/battleshipBoardInterface';
import '../style/placement.scss';

interface PlayersData {
    vsComputer: boolean;
    players: string[];
}

const ships= document.querySelectorAll('.ship');
const boardsPanel = document.querySelector('.boards-panel')!;
let board1: HTMLDivElement;
let board2: HTMLDivElement;

function getPlayerData() {
    const playersDataJson:string = localStorage.getItem('battleship-players-data')!;
    const playersData:PlayersData = JSON.parse(playersDataJson) as PlayersData;
    return playersData;
}

function setupBoardGame() {
    boardsPanel.innerHTML = '';

    board1 = generateBoard();
    board2 = generateBoard();

    board1.setAttribute('data-index', '0');
    board2.setAttribute('data-index', '1');
    boardsPanel.appendChild(board1);
    boardsPanel.appendChild(board2);

    const squares = document.querySelectorAll('.square[data-coord]');
    squares.forEach(square => {
        square.addEventListener('dragenter', dragenter);
        square.addEventListener('dragleave', dragleave);
    });
}

function toggleShipDirection() {
    this.dataset.vertical === 'false'?
    this.setAttribute('data-vertical', 'true'):
    this.setAttribute('data-vertical', 'false');
}

function dragging(e) {
    console.log(e.offsetX);
    this.classList.add('dragging');
}

function dragend() {
    this.classList.remove('dragging');
}

function dragenter() {
    this.style.background = 'green';
}

function dragleave() {
    this.style.background = 'none';

    const ship = document.querySelector('.dragging');
    this.appendChild(ship);
}

export function initialize() {
    setupBoardGame();
    console.log(getPlayerData());

    ships.forEach(ship => {
        ship.addEventListener('click', toggleShipDirection);
        ship.addEventListener('dragstart', dragging);
        ship.addEventListener('dragend', dragend);
    });
}
