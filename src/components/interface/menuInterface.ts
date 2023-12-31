const chooseOpponentBtn = document.querySelectorAll<HTMLButtonElement>('.btn-opponent');
const inputNameModal = document.querySelector<HTMLDialogElement>('#input-name-modal')!;
const firstInputLabel = inputNameModal.querySelector<HTMLLabelElement>('#name-p1 label')!;
const secondPlayerDiv = inputNameModal.querySelector<HTMLDivElement>('#name-p2')!;

function singlePlayer() {
    if (secondPlayerDiv) {
        firstInputLabel.textContent = 'What\'s your name, Captain?';
        secondPlayerDiv.style.display = 'none'; 
    }
}

function multiPlayer() {
    if (secondPlayerDiv) {
        firstInputLabel.textContent = 'Player-1 Name';
        secondPlayerDiv.style.display = 'block';
    }
}

function openInputModal(e: Event) {
    const button = e.target as HTMLButtonElement;
    button.hasAttribute('data-vs-computer') ? singlePlayer() : multiPlayer();
    inputNameModal.showModal();
}

chooseOpponentBtn.forEach(btn => {
    btn.addEventListener('click', openInputModal);
});

inputNameModal?.addEventListener('click', (e) => {
    if (e.target === inputNameModal) inputNameModal.close();
});
