import generateBoard from '../../utilities/battleshipBoardInterface';
import GameBoard from '../../gameTemplates/gameboard';
import Ship from '../../gameTemplates/ship';

import { fleetStandard } from '../../utilities/fleet';
import { coordinateSeeker } from '../../utilities/coordinatesHandler';
import '../style/placement.scss';

const ships= document.querySelectorAll('.ship');
const boardsPanel = document.querySelector('.boards-panel')!;

interface PlayersData {
    vsComputer: boolean;
    players: string[];
}

interface shipOffsetData {
    direction: string;
    span: number;
}

class PlacementState {
    playersData: PlayersData;
    player1Board: GameBoard;
    player2Board: GameBoard;
    currentBoard: GameBoard;

    constructor() {
        this.playersData = getPlayerData();
        this.player1Board = new GameBoard;
        this.player2Board = new GameBoard;
        this.currentBoard = this.player1Board;
    }

    getPlayerData() {
        const playersDataJson:string = localStorage.getItem('battleship-players-data')!;
        const playersData:PlayersData = JSON.parse(playersDataJson) as PlayersData;
        return playersData;
    }

    setNameOnHeader() {
        const h1:HTMLHeadingElement = document.querySelector('#player-name')!;

        this.currentBoard === this.player1Board?
        h1.textContent = `${this.playersData.players[0]}'s Fleet`:
        h1.textContent = `${this.playersData.players[1]}'s Fleet`;
    }

    setStartBtnContent() {
        const btn:HTMLButtonElement = document.querySelector('#start-btn')!;
        
        if (this.playersData.vsComputer) {
            btn.textContent = 'Start Game';
        } else {
            this.currentBoard === this.player1Board?
            btn.textContent = `${this.playersData.players[1]}'s Fleet`:
            btn.textContent = 'Start Game';
        }
    }

    initialize() {
        this.setNameOnHeader();
        this.setStartBtnContent();
    }
}

const fleet: Record<string, Ship> = fleetStandard();
const placementState = new PlacementState;

const gameBoard = new GameBoard;

let shipOffsetData: shipOffsetData;
let currentShipDrag: Ship;

function getPlayerData() {
    const playersDataJson:string = localStorage.getItem('battleship-players-data')!;
    const playersData:PlayersData = JSON.parse(playersDataJson) as PlayersData;
    return playersData;
}

function setupBoardGame() {
    boardsPanel.innerHTML = '';

    const board1 = generateBoard();
    const board2 = generateBoard();

    board1.setAttribute('data-index', '0');
    board2.setAttribute('data-index', '1');
    boardsPanel.appendChild(board1);
    boardsPanel.appendChild(board2);

    const squares = document.querySelectorAll('.square[data-coord]');
    squares.forEach(square => {
        square.addEventListener('dragenter', dragenter as EventListener);
        square.addEventListener('dragleave', dragleave as EventListener);
    });
}

function toggleShipDirection(this:HTMLDivElement) {
    this.dataset.vertical === 'false'?
    this.setAttribute('data-vertical', 'true'):
    this.setAttribute('data-vertical', 'false');

    const shipKey:string = this.dataset.character!;
    const ship:Ship = fleet[shipKey];
    ship.toggleDirection();
}

//  returns the length (num of squares) of the ship dragstart event from the cursor location to 
//  the left(horizontal) or top(vertical) of the ship div element.
function setShipOffsetData(e:MouseEvent | DragEvent) {
    const shipElement = e.target as HTMLDivElement;
    const datasetLength: string | undefined = shipElement.dataset.length;
    let totalShipSquares = 0;

    if (datasetLength !== undefined) totalShipSquares = parseInt(datasetLength);
    let direction: string;
    let shipLength: number;
    let offset: number;

    shipElement.dataset.vertical === 'true'? direction='top': direction='left';

    if (shipElement.dataset.vertical === 'true') {
        shipLength = shipElement.offsetHeight;
        offset = e.offsetY;
    } else {
        shipLength = shipElement.offsetWidth;
        offset = e.offsetX;
    }

    const offsetPercentage:number = Math.round(offset / shipLength * 100);
    let shipCurrentSquare:number = Math.round(totalShipSquares * offsetPercentage / 100);
    if (shipCurrentSquare < 1) shipCurrentSquare = 1;
    const span:number = shipCurrentSquare - 1;

    shipOffsetData = { direction, span };
}

//  For the valid and invalid square highlights in UI board,  
//  this returns data for the coordinateSeeker parameters. The current shipOffsetData (dragstart) 
//  and the current square (dragenter) coordinates.   
function getCoordOffsetData(e:Event) {
    const currentSquareDiv = e.target as HTMLDivElement;
    const currentCoordinates = currentSquareDiv.dataset.coord?.split('-')
                              .map(x => parseInt(x));
    const { direction, span } = shipOffsetData;

    return [ currentCoordinates, direction, span ]; 
}

function findSquareOrigin(e: DragEvent | MouseEvent) {
    const offsetData: (string | number | number[] | undefined)[] = getCoordOffsetData(e);
    const squareOrigin:number[] = coordinateSeeker(
        offsetData[0] as number[],
        offsetData[1] as string,
        offsetData[2] as number
    );

    return squareOrigin;
}

function highlightSquares(currentShip: Ship, squareOrigin:number[]) {
    const datasetSquareOrigin = squareOrigin.join('-');
    const { canBePlaced, coordinates } = gameBoard.seekCoordinates(currentShip, datasetSquareOrigin);

    const squareNodes:HTMLDivElement[] = [];

    coordinates.forEach((coord) => {
        const datasetCoord = coord.join('-');
        const squareDiv:HTMLDivElement = document.querySelector(`.square[data-coord="${datasetCoord}"]`)!;
        squareNodes.push(squareDiv);
    });

    const squares = document.querySelectorAll('.square');
    squares.forEach(square => square.removeAttribute('data-placement'));

    canBePlaced? 
    squareNodes.forEach(square => square.setAttribute('data-placement', 'valid')):
    squareNodes.forEach(square => square.setAttribute('data-placement', 'invalid'));
}

// ==================================================    EVENTS   =======================================================================
// ==================================================    EVENTS   =======================================================================

function dragging(this:HTMLDivElement, e:DragEvent | MouseEvent | Event) {
    setShipOffsetData(e as MouseEvent);   
    this.classList.add('dragging');

    const shipKey:string = this.dataset.character!;
    const currentShip:Ship = fleet[shipKey];

    currentShipDrag = currentShip;
}

function dragend(this:HTMLDivElement) {
    this.classList.remove('dragging');
}

function dragenter(e:DragEvent | MouseEvent) {
    const squareOrigin = findSquareOrigin(e);
        
    if (squareOrigin[0] < 1 || squareOrigin[1] < 1) return;
    highlightSquares(currentShipDrag, squareOrigin);
}

function dragleave(this:HTMLDivElement) {
    // this.style.background = 'none';
}

export function initialize() {
    setupBoardGame();
    console.log(placementState.playersData);
    placementState.initialize();

    // set ship directions to horizontal as default.
    for (const ship in fleet) {
        fleet[ship].toggleDirection();
    }

    ships.forEach(ship => {
        ship.addEventListener('click', toggleShipDirection);
        ship.addEventListener('dragstart', dragging);
        ship.addEventListener('dragend', dragend);
    });
}
