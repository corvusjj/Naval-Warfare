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
    boardsPanel.innerHTML = '';

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
    const playersData = JSON.parse(playersDataJson) as PlayersData;

    playersData.vsComputer?
    gameOperations.setGameState(true, [playersData.players[0]]):
    gameOperations.setGameState(false, [playersData.players[0], playersData.players[1]]);
}

function setPLayersDataOnBoards() {
    const [firstplayerData, secondPlayerData] = gameOperations.getPlayersData();
    board1.setAttribute('data-player-id', firstplayerData[1]);
    board1.setAttribute('data-player-name', firstplayerData[0]);
    board2.setAttribute('data-player-id', secondPlayerData[1]);
    board2.setAttribute('data-player-name', secondPlayerData[0]);
    interfaceMethods.toggleBoardUI(1);  // player 2 defender as default
}

interface Ship {
    length: number;
    hits: number;
    isVertical: boolean;
    sunk: boolean;
}
    
interface PlacementData {
    board: string[][];
    ships: Record<string, Ship>;
    shipCoordinates: Record<string, number[][]>;
}

function getPlacementData() {
    const boardsDataJson:string = window.localStorage.getItem('battleship-player-boards')!;
    const playerBoards:PlacementData[] = JSON.parse(boardsDataJson) as PlacementData[];

    return playerBoards;
}

function placeShips(placementData:PlacementData[]) {
    placementData.forEach(playerBoardData => {
        const playerIndex = placementData.indexOf(playerBoardData);

        const shipCoordinates = playerBoardData.shipCoordinates;
        const playerShips = playerBoardData.ships;
        const shipKeys = Object.keys(playerShips);

        shipKeys.forEach(key => {
            const ship = playerShips[key];
            const isVertical:boolean = ship.isVertical;
            const squareOrigin:string = shipCoordinates[key][0].join('-');
            
            //  place ships on game-data
            playerIndex === 0?
            gameOperations.placeFirstPlayerShip(key, isVertical, squareOrigin):
            gameOperations.placeSecondPlayerShip(key, isVertical, squareOrigin);

            //  --------------  INTERFACE  ---------------
            //  handle ship div element
            let shipDiv:HTMLDivElement;

            playerIndex === 0?
            shipDiv = document.querySelector(`.p1-deployed-ship[data-ship-key=${key}]`)!:
            shipDiv = document.querySelector(`.p2-deployed-ship[data-ship-key=${key}]`)!;

            const horizontalShipImage:HTMLImageElement = shipDiv.children[0] as HTMLImageElement;
            const verticalShipImage:HTMLImageElement = shipDiv.children[1] as HTMLImageElement;

            if (isVertical) {
                horizontalShipImage.style.display = 'none';
                shipDiv?.setAttribute('data-vertical', 'true');
            } else {
                verticalShipImage.style.display = 'none';
                shipDiv?.setAttribute('data-vertical', 'false');
            }

            //  place ship div on board
            let currentBoard:HTMLDivElement;
            playerIndex === 0? currentBoard = board1: currentBoard = board2;

            currentBoard.appendChild(shipDiv);
            const squareDivOrigin = currentBoard.querySelector(`[data-coord="${squareOrigin}"]`)!;

            const squareDistanceLeft = squareDivOrigin.getBoundingClientRect().left - currentBoard.getBoundingClientRect().left;
            const squareDistanceTop = squareDivOrigin.getBoundingClientRect().top - currentBoard.getBoundingClientRect().top;
            shipDiv.style.left = squareDistanceLeft + 'px';
            shipDiv.style.top = squareDistanceTop + 'px';
        });
    });
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
    //  display board interface
    setupBoardGame();
    console.log('hi');

    setGameState();
    setPLayersDataOnBoards();

    const placementData:PlacementData[] = getPlacementData();
    placeShips(placementData);
}

export { interfaceMethods }

//  display p1Ships if vsPlayer
