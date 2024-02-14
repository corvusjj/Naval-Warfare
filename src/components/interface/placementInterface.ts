import generateBoard from '../../utilities/battleshipBoardInterface';
import GameBoard from '../../gameTemplates/gameboard';
import Ship from '../../gameTemplates/ship';

import { fleetStandard } from '../../utilities/fleet';
import { coordinateSeeker } from '../../utilities/coordinatesHandler';
import setupAllCoordinates from '../../utilities/battleshipCoordinates';
import '../style/placement.scss';

const ships= document.querySelectorAll('.ship');
const boardsPanel = document.querySelector('.boards-panel')!;
const resetFleetBtn = document.querySelector('#reset-btn');
const randomFleetBtn = document.querySelector('#random-btn');
const startBtn:HTMLButtonElement = document.querySelector('#start-btn')!;
const wavesAudio:HTMLAudioElement = document.querySelector('#waves-audio')!;

wavesAudio.volume = 0.7;

export interface PlayersData {
    vsComputer: boolean;
    players: string[];
}

interface shipOffsetData {
    direction: string;
    span: number;
}

interface draggedShipValidity {
    canBePlaced: boolean;
    coordinates: number[][];
}

class PlacementState {
    playersData: PlayersData;
    player1Board: GameBoard;
    player2Board: GameBoard;
    currentBoard: GameBoard;
    currentBoardInterface: HTMLDivElement;
    activeFleet: Record<string, Ship>;

    constructor() {
        this.playersData = getPlayerData();
        this.player1Board = new GameBoard;
        this.player2Board = new GameBoard;
        this.currentBoard = this.player1Board;

        this.currentBoardInterface = document.createElement('div');
        this.activeFleet = fleetStandard();
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
        if (this.playersData.vsComputer) {
            startBtn.textContent = 'Start Game';
        } else {
            this.currentBoard === this.player1Board?
            startBtn.textContent = `${this.playersData.players[1]}'s Fleet`:
            startBtn.textContent = 'Start Game';
        }
    }

    setStartBtnState() {
        const shipsStatus = placementState.currentBoard.getShipsStatus();
        const numOfShips:number = Object.keys(shipsStatus).length;

        numOfShips === 5? startBtn.classList.add('active'): startBtn.classList.remove('active');
    }

    setCurrentBoardInterface() {
        this.currentBoard === this.player1Board?
        this.currentBoardInterface = document.querySelector('.board[data-index="0"]')!:
        this.currentBoardInterface = document.querySelector('.board[data-index="1"]')!;
    }

    resetFleet() {
        this.currentBoard.reset();
        this.activeFleet = fleetStandard();

        // set ship directions to horizontal as default.
        for (const ship in this.activeFleet) {
            this.activeFleet[ship].toggleDirection();
        }

        this.setStartBtnState();
    }

    toggleSecondPlayerBoard() {
        this.currentBoard = this.player2Board;
        this.setCurrentBoardInterface();

        if (!this.playersData.vsComputer) {
            boardsPanel.classList.add('toggle-panel');
            this.setNameOnHeader();
            this.setStartBtnContent();
        }
    }

    startGame() {
        const playerBoards = [placementState.player1Board, placementState.player2Board];
        localStorage.setItem('battleship-player-boards', JSON.stringify(playerBoards));

        const gameLink = document.querySelector<HTMLAnchorElement>('#start-game-link')!;
        gameLink.click();
    }

    initialize() {
        this.setNameOnHeader();
        this.setStartBtnContent();
        this.setCurrentBoardInterface();
        this.resetFleet();
    }
}

const placementState = new PlacementState;

let shipOffsetData: shipOffsetData;
let currentShipDrag: Ship;
let currentShipDragValidity: draggedShipValidity;
const dragSquareNodes:HTMLDivElement[] = [];

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
        square.addEventListener('dragover', dragover as EventListener);
        square.addEventListener('drop', drop as EventListener);
    });
}

function toggleShipDirection(this:HTMLDivElement) {
    this.dataset.vertical === 'false'?
    this.setAttribute('data-vertical', 'true'):
    this.setAttribute('data-vertical', 'false');

    const shipKey:string = this.dataset.character!;
    const ship:Ship = placementState.activeFleet[shipKey];
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

function setShipDragValidity(currentShip: Ship, squareOrigin:number[]) {
    const datasetSquareOrigin = squareOrigin.join('-');
    const currentGameBoard = placementState.currentBoard;
    currentShipDragValidity = currentGameBoard.seekCoordinates(currentShip, datasetSquareOrigin);
}

function highlightActiveSquares() {
    resetDragSquareNodes();

    currentShipDragValidity.coordinates.forEach((coord) => {
        const datasetCoord = coord.join('-');

        const currentBoardInterface = placementState.currentBoardInterface;
        const squareDiv:HTMLDivElement = currentBoardInterface.querySelector(`.square[data-coord="${datasetCoord}"]`)!;
        dragSquareNodes.push(squareDiv);
    });

    currentShipDragValidity.canBePlaced? 
    dragSquareNodes.forEach(square => square.setAttribute('data-placement', 'valid')):
    dragSquareNodes.forEach(square => square.setAttribute('data-placement', 'invalid'));
}

function resetDragSquareNodes() {
    dragSquareNodes.forEach(square => square.removeAttribute('data-placement'));
    dragSquareNodes.length = 0;
}

function placeShip() {
    //  INTERFACE SHIP PLACEMENT
    const currentShip = document.querySelector<HTMLDivElement>('.dragging')!;
    const board = placementState.currentBoardInterface;
    const squareDivOrigin = dragSquareNodes[0];
    
    currentShip.classList.remove('ship-default');
    board.appendChild(currentShip);
    
    const squareDistanceLeft = squareDivOrigin.getBoundingClientRect().left - board.getBoundingClientRect().left;
    const squareDistanceTop = squareDivOrigin.getBoundingClientRect().top - board.getBoundingClientRect().top;
    currentShip.style.left = squareDistanceLeft + 'px';
    currentShip.style.top = squareDistanceTop + 'px';

    //  GAME-DATA SHIP PLACEMENT
    const activeShip:Ship = currentShipDrag;
    const coord:string = squareDivOrigin.dataset.coord!;
    const shipKey:string = currentShip.dataset.character!;

    placementState.currentBoard.placeShip(
        activeShip,
        coord,
        shipKey
    );
}

function randomPlacement() {
    resetPlacement();
    const fleet = [...ships] as HTMLDivElement[];
    const coordinates:number[][] = setupAllCoordinates();

    fleet.forEach(shipDiv => {
        //  Random ship direction
        const isVertical:boolean = Math.random() < 0.5;
        if (isVertical) shipDiv.click();

        //  Emulate dragging
        shipDiv.classList.add('dragging');
        const shipKey:string = shipDiv.dataset.character!;
        const currentShip:Ship = placementState.activeFleet[shipKey];
        currentShipDrag = currentShip;

        //  Find available coordinates with recursion, emulate dragenter
        function chooseValidSquare() {
            const randomIndex:number = Math.floor(Math.random() * coordinates.length);
            const chosenCoord:number[] = coordinates[randomIndex];

            const currentGameBoard = placementState.currentBoard;
            const shipPlacementValidity = currentGameBoard.seekCoordinates(currentShip, chosenCoord.join('-'));

            if (!shipPlacementValidity.canBePlaced) return chooseValidSquare();
            
            const datasetCoord = chosenCoord.join('-');
            const currentBoardInterface = placementState.currentBoardInterface;
            const squareDiv:HTMLDivElement = currentBoardInterface.querySelector(`.square[data-coord="${datasetCoord}"]`)!;
            dragSquareNodes.push(squareDiv);
        }
        chooseValidSquare();
        
        //  Place current ship, emulate drop
        placeShip();
        placementState.setStartBtnState();

        //  Emulate dragend
        const currentShipDiv = document.querySelector<HTMLDivElement>('.dragging')!
        currentShipDiv.classList.remove('dragging');
        resetDragSquareNodes();
    });
}

function resetPlacement() {
    placementState.currentBoard.reset();
    placementState.resetFleet();

    const shipContainers = [...document.querySelectorAll<HTMLDivElement>('.ship-container')];
    const fleet = [...ships] as HTMLDivElement[];

    shipContainers.forEach(container => {
        const shipName = container.id;
        const currentShip = fleet.find(shipDiv => shipDiv.dataset.ship === shipName)!;

        container.appendChild(currentShip);
        currentShip.style.left = '50%';
        currentShip.style.top = '50%';
        currentShip.dataset.vertical = 'false';
        currentShip.classList.add('ship-default');
    });
}

function runStartBtn() {
    if (placementState.playersData.vsComputer) {
        placementState.toggleSecondPlayerBoard();
        randomPlacement();
        placementState.startGame();
    } else if (placementState.currentBoard === placementState.player1Board) {
        placementState.toggleSecondPlayerBoard();
        setTimeout(() => resetPlacement(), 500);
    } else {
        placementState.startGame();
    }
}

// ==================================================    EVENTS   =======================================================================
// ==================================================    EVENTS   =======================================================================

function dragging(this:HTMLDivElement, e:DragEvent | MouseEvent | Event) {
    setShipOffsetData(e as MouseEvent);   
    this.classList.add('dragging');

    const shipKey:string = this.dataset.character!;
    const currentShip:Ship = placementState.activeFleet[shipKey];

    currentShipDrag = currentShip;
}

function dragend(this:HTMLDivElement) {
    this.classList.remove('dragging');
    resetDragSquareNodes();
}

function dragenter(e:DragEvent | MouseEvent) {
    const squareOrigin = findSquareOrigin(e);
        
    if (squareOrigin[0] < 1 || squareOrigin[1] < 1) return resetDragSquareNodes();
    setShipDragValidity(currentShipDrag, squareOrigin);
    highlightActiveSquares();
}

function dragleave() {
    // resetDragSquareNodes();
}

function dragover(e:DragEvent) {
    e.preventDefault();
}

function drop() {
    const validArea:boolean = currentShipDragValidity.canBePlaced;
    if (validArea) placeShip();

    placementState.setStartBtnState();
}

export function initialize() {
    setupBoardGame();
    console.log(placementState.playersData);
    placementState.initialize();

    ships.forEach(ship => {
        ship.addEventListener('click', toggleShipDirection);
        ship.addEventListener('dragstart', dragging);
        ship.addEventListener('dragend', dragend);
    });

    resetFleetBtn?.addEventListener('click', resetPlacement);
    randomFleetBtn?.addEventListener('click', randomPlacement);
    startBtn.addEventListener('click', runStartBtn);
    void wavesAudio.play();
}
