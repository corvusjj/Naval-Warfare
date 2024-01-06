interface PlayersData {
    vsComputer: boolean;
    players: string[];
  }

const chooseOpponentBtn = document.querySelectorAll<HTMLButtonElement>('.btn-opponent');
const inputNameModal = document.querySelector<HTMLDialogElement>('#input-name-modal')!;
const firstInputLabel = inputNameModal.querySelector<HTMLLabelElement>('#name-p1 label')!;
const secondPlayerDiv = inputNameModal.querySelector<HTMLDivElement>('#name-p2')!;
const submitBtn = inputNameModal.querySelector<HTMLButtonElement>('#submit-btn');

let singlePlayerMode = true;

function singlePlayer() {
    if (secondPlayerDiv) {
        firstInputLabel.textContent = 'What\'s your name, Captain?';
        secondPlayerDiv.style.display = 'none';
        singlePlayerMode = true; 
    }
}

function multiPlayer() {
    if (secondPlayerDiv) {
        firstInputLabel.textContent = 'Player-1 Name';
        secondPlayerDiv.style.display = 'block';
        singlePlayerMode = false;
    }
}

function openInputModal(e: Event) {
    const button = e.target as HTMLButtonElement;
    button.hasAttribute('data-vs-computer') ? singlePlayer() : multiPlayer();
    inputNameModal.showModal();
}

function submitName(e:Event) {
    e.preventDefault();

    const firstInput = inputNameModal.querySelector<HTMLInputElement>('#name-p1 input')!;
    const secondInput = inputNameModal.querySelector<HTMLInputElement>('#name-p2 input')!;

    if (firstInput.value.length < 1) return;
    if (singlePlayerMode === false && secondInput.value.length < 1) return;

    const playersData:PlayersData = {
        vsComputer: singlePlayerMode,
        players: [firstInput.value, secondInput.value]
    };

    localStorage.setItem('battleship-players-data', JSON.stringify(playersData));
    window.location.href = './src/pages/placement.html';
}

export function initialize() {
    chooseOpponentBtn.forEach(btn => {
        btn.addEventListener('click', openInputModal);
    });
    
    submitBtn?.addEventListener('click', submitName);
    
    inputNameModal?.addEventListener('click', (e) => {
        if (e.target === inputNameModal) inputNameModal.close();
    });
}   
