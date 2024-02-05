import { gameOperations } from '../../gameInterfaceHandler';
import generateBoard from '../../utilities/battleshipBoardInterface';
import { PlayersData } from './placementInterface';
import { audioInit } from '../../utilities/controlPanel';
import '../style/game.scss';

let playersData:PlayersData;

const main = document.querySelector('main');
const gameBoardContainer = document.querySelector('.gameboard-container')!;
const boardsPanel = document.querySelector('.boards-panel')!;
const p1Ships = document.querySelector<HTMLDivElement>('.p1-ships')!;
const p2Ships = document.querySelector<HTMLDivElement>('.p2-ships')!;

const attackHighlights = document.querySelectorAll<HTMLDivElement>('.attack-highlight')!
const attackHighlightX = document.querySelector<HTMLDivElement>('.attack-highlight.vertical')!;
const attackHighlightY = document.querySelector<HTMLDivElement>('.attack-highlight.horizontal')!;

const attackingPlayerSpan = document.querySelector<HTMLSpanElement>('#attacking-player')!;
const seeFleetBtn = document.querySelector<HTMLButtonElement>('#see-fleet-btn')!;

const modals = document.querySelectorAll<HTMLDialogElement>('.modal')!;

const gameOverModal = document.querySelector<HTMLDialogElement>('#game-over-modal')!;
const winnerSpan = document.querySelector<HTMLSpanElement>('#winner-name')!;
const p1FleetModal = document.querySelector<HTMLDivElement>('.fleet-modal[data-player="1"]')!;
const p2FleetModal = document.querySelector<HTMLDivElement>('.fleet-modal[data-player="2"]')!;

const settingsModal = document.querySelector<HTMLDialogElement>('#settings-modal')!;
const settingsBtn = document.querySelector<HTMLButtonElement>('#settings-btn')!;
const shipMotionBtn = document.querySelector<HTMLButtonElement>('#ui-motion-btn')!;

const errorIcon = document.querySelector('.miss-icon')!
const fireGif = document.querySelector('.fire-gif')!;

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
    squares.forEach(square => square.addEventListener('click', (e) => attack(e, false)));
}

function setGameState() {
    const playersDataJson = window.localStorage.getItem('battleship-players-data')!;
    playersData = JSON.parse(playersDataJson) as PlayersData;

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

            //  reveal player 1 ships if vsComputer
            if (playerIndex === 0 && playersData.vsComputer) revealShip(shipDiv, false);
        });
    });
}

function revealShip(shipDiv:HTMLDivElement, isSunk:boolean) {
    if (isSunk) shipDiv.classList.add('sunk');
    shipDiv.classList.add('show');
}

function setBoardPanelState(active:boolean) {
    active === true? 
    boardsPanel.classList.remove('inactive'):
    boardsPanel.classList.add('inactive');
}

function attack(e: Event, vsComputerTurn:boolean) {
    const squareNode = e.target as HTMLDivElement; 
    const stringCoord = squareNode.dataset.coord!;
    const coordinates = stringCoord.split('-');

    gameOperations.attack(coordinates.map(x => parseInt(x)), vsComputerTurn);
    squareNode.style.pointerEvents = 'none';

    setBoardPanelState(false);
}

function runAttackHighlights(squareDiv:HTMLDivElement) {
    const squareDistanceLeft = squareDiv.getBoundingClientRect().left - gameBoardContainer?.getBoundingClientRect().left;
    const squareDistanceTop = squareDiv.getBoundingClientRect().top - gameBoardContainer?.getBoundingClientRect().top;
    attackHighlights.forEach(div => div.classList.add('show'));
    attackHighlightX.style.transform = `translateX(${squareDistanceLeft + 33}px)`;
    attackHighlightY.style.transform = `translateY(${squareDistanceTop + 33}px)`;

    function highlightsToRandomOrigin() {
        const rightOrigin:boolean = Math.random() < 0.5;
        const bottomOrigin:boolean = Math.random() < 0.5;

        attackHighlights.forEach(div => div.classList.remove('show'));
        rightOrigin? attackHighlightX.style.transform = 'translateX(507px)': attackHighlightX.style.transform = 'translateX(0)';
        bottomOrigin? attackHighlightY.style.transform = 'translateY(507px)': attackHighlightY.style.transform = 'translateX(0)';
    }

    setTimeout(highlightsToRandomOrigin, 800);
}

function generateIconElement(state:string) {
    switch (state) {
        case 'miss': {
            const newErrorIcon:HTMLDivElement = errorIcon.cloneNode(true) as HTMLDivElement;
            newErrorIcon.classList.add('show');
            return newErrorIcon;
        }
            
        case 'hit': {
            const newFireGif:HTMLDivElement = fireGif.cloneNode(true) as HTMLDivElement;   
            newFireGif.classList.add('show');
            return newFireGif;
        }

        default: {
            const emptyDiv:HTMLDivElement = document.createElement('div');
            return emptyDiv;
        }
    }
}

function animateAttackerText(text:string) {
    attackingPlayerSpan.textContent = '';
    let currentIndex = 0;
    const content = text.split('');

    function addText() {
        if (currentIndex > content.length - 1) return;
        attackingPlayerSpan.textContent += content[currentIndex];
        currentIndex += 1;

        setTimeout(addText, 70);
    }

    addText();
}

function revealRemainingShips(attackerId:string) {
    const p1Id = gameOperations.getPlayersData()[0][1];
    const remainingShips = gameOperations.getState().attacker.ships;
    const shipKeys = Object.keys(remainingShips);
    let shipDiv: HTMLDivElement;

    shipKeys.forEach(key => {
        if (!remainingShips[key].isSunk()) {
            p1Id === attackerId?
            shipDiv = document.querySelector(`.p1-deployed-ship[data-ship-key=${key}]`)!:
            shipDiv = document.querySelector(`.p2-deployed-ship[data-ship-key=${key}]`)!;

            revealShip(shipDiv, false);
        }
    });
}

function setupFleetsInGameOverModal(attackerId:string) {
    revealRemainingShips(attackerId);
    const p2Fleet = board2.cloneNode(true);
    const p1Fleet = board1.cloneNode(true);

    p1FleetModal.appendChild(p1Fleet);
    p2FleetModal.appendChild(p2Fleet);

    const p1FleetH3 = p1FleetModal.querySelector<HTMLHeadingElement>('h3')!;
    const p2FleetH3 = p2FleetModal.querySelector<HTMLHeadingElement>('h3')!;
    p1FleetH3.textContent = playersData.players[0] + '\'s Fleet';
    p2FleetH3.textContent = playersData.players[1] + '\'s Fleet';
}

function toggleShipMotion() {
    if (shipMotionBtn.dataset.active === 'true') {
        shipMotionBtn.setAttribute('data-active', 'false');
        main?.classList.remove('ship-motion');
    } else {
        shipMotionBtn.setAttribute('data-active', 'true');
        main?.classList.add('ship-motion');
    }
}

const interfaceMethods = {
    toggleBoardUI: (index: number) => {
        function toggleBoard() {
            if (index === 0) {
                animateAttackerText(playersData.players[1] + ' to attack...');
                boardsPanel.classList.remove('toggle-panel');
                p2Ships.style.display = 'none';
                p1Ships.style.display = 'flex';
            } else {
                animateAttackerText(playersData.players[0] + ' to attack...');
                boardsPanel.classList.add('toggle-panel');
                p1Ships.style.display = 'none';
                p2Ships.style.display = 'flex';
            }
        }
        requestAnimationFrame(toggleBoard);
    },

    markSquareUI: (square: number[], boardId: string, state:string) => {
        const [x, y] = square.map(num => num.toString());
        const board:HTMLDivElement = document.querySelector(`[data-player-id="${boardId}"]`)!;
        const tileUI:HTMLDivElement = board.querySelector(`[data-coord="${x}-${y}"]`)!;

        requestAnimationFrame(() => runAttackHighlights(tileUI));

        const markIcon:HTMLDivElement = generateIconElement(state)!; 
        setTimeout(() => { tileUI.appendChild(markIcon)}, 600);
    },

    setBoardPanelToActive: () => {
        setBoardPanelState(true);
    },

    animateHitByComputer: () => {
        if (!main?.classList.contains('ship-motion')) return;
        main?.classList.add('ship-hit');
        setTimeout(() => main.classList.remove('ship-hit'), 300);
    },

    handleSunkShip: (defenderId:string, shipKey:string, coordinates:number[][]) => {
        const p1Id = gameOperations.getPlayersData()[0][1];

        const defenderBoard:HTMLDivElement = document.querySelector(`.board[data-player-id="${defenderId}"]`)!;
        let deployedSunkShip:HTMLDivElement;
        let sideBarEnemyShip:HTMLDivElement;

        if (defenderId === p1Id) {    
            deployedSunkShip = document.querySelector(`.p1-deployed-ship[data-ship-key=${shipKey}]`)!;
            sideBarEnemyShip = document.querySelector(`.p1-ships > [data-ship-key=${shipKey}]`)!;
        } else {
            deployedSunkShip = document.querySelector(`.p2-deployed-ship[data-ship-key=${shipKey}]`)!;
            sideBarEnemyShip = document.querySelector(`.p2-ships > [data-ship-key=${shipKey}]`)!;
        }

        setTimeout(() => {
            revealShip(deployedSunkShip, true);
            sideBarEnemyShip.classList.add('sunk');
            sideBarEnemyShip.classList.add('animate-eliminated');
        }, 600);

        setTimeout(() => sideBarEnemyShip.classList.remove('animate-eliminated'), 1200);

        //  remove hit icons
        setTimeout(() => {
            coordinates.forEach(square => {
                const dataCoord = square.join('-');
                const tileUI = defenderBoard.querySelector(`.square[data-coord="${dataCoord}"]`);
    
                while(tileUI?.firstChild) {
                    tileUI.removeChild(tileUI.firstChild);
                }
            });
        }, 600);
    },

    handleGameOver: (winnerName:string, attackerId:string) => {
        winnerSpan.textContent = winnerName;
        setTimeout(setBoardPanelState, 700, false);
        setTimeout(() => setupFleetsInGameOverModal(attackerId), 700);

        setTimeout(() => {
            gameOverModal.showModal();
            attackingPlayerSpan.style.display = 'none';
            seeFleetBtn.style.display = 'block';
        }, 1500);
    }
}

export function initialize() {
    setupBoardGame();
    console.log('hi');

    setGameState();
    setPLayersDataOnBoards();

    const placementData:PlacementData[] = getPlacementData();
    placeShips(placementData);

    audioInit();

    seeFleetBtn.addEventListener('click', () => gameOverModal.showModal());
    settingsBtn.addEventListener('click', () => settingsModal.showModal());
    shipMotionBtn.addEventListener('click', toggleShipMotion);

    modals.forEach(modal => modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    }));
}

export { interfaceMethods }

//  ship hit ui animation
//  computer name