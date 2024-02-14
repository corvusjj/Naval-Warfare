import '../style/menu.scss';

interface PlayersData {
    vsComputer: boolean;
    players: string[];
}

const chooseOpponentBtn = document.querySelectorAll<HTMLButtonElement>('.btn-opponent');
const inputNameModal = document.querySelector<HTMLDialogElement>('#input-name-modal')!;
const firstInputLabel = inputNameModal.querySelector<HTMLLabelElement>('#name-p1 label')!;
const secondPlayerDiv = inputNameModal.querySelector<HTMLDivElement>('#name-p2')!;
const submitBtn = inputNameModal.querySelector<HTMLButtonElement>('#submit-btn');
const imageContainer = document.querySelector<HTMLDivElement>('.image-container')!;
const carouselBtn = document.querySelectorAll<HTMLButtonElement>('.carousel-btn');

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
    if (!singlePlayerMode && secondInput.value.length < 1) return;

    if (singlePlayerMode) secondInput.value = 'Admiral Bot';

    const playersData:PlayersData = {
        vsComputer: singlePlayerMode,
        players: [firstInput.value, secondInput.value]
    };

    localStorage.setItem('battleship-players-data', JSON.stringify(playersData));
    window.location.href = './src/pages/placement.html';
}

const carouselImages:HTMLImageElement[] = [];

function switchImage(e:MouseEvent) {
    const activeImage = document.querySelector('img[data-active]');
    let imgIndex = carouselImages.findIndex(img => img === activeImage);

    function previousIndex() {
        imgIndex -= 1;
        if (imgIndex < 0) imgIndex = carouselImages.length - 1;
    }

    function nextIndex() {
        imgIndex += 1;
        if (imgIndex > carouselImages.length - 1) imgIndex = 0;
    }
    
    const btn = e.target as HTMLButtonElement;
    btn.dataset.switch === 'next'? nextIndex(): previousIndex();
    
    carouselImages[imgIndex].setAttribute('data-active', '');
    activeImage?.removeAttribute('data-active');
}

function loadImages() {
    const imgNames = ['activist-1', 'activist-2', 'navy-3', 'map', 'navy-2', 'navy-1', 'prime-ministers'];

    for (const [index, name] of imgNames.entries()) {
        const img = document.createElement('img');
        img.src = `../../images/${name}.webp`;
        imageContainer.appendChild(img);

        carouselImages.push(img);
        if (index === 0) img.setAttribute('data-active', '');
    }
}

export function initialize() {
    chooseOpponentBtn.forEach(btn => {
        btn.addEventListener('click', openInputModal);
    });
    
    submitBtn?.addEventListener('click', submitName);
    
    inputNameModal?.addEventListener('click', (e) => {
        if (e.target === inputNameModal) inputNameModal.close();
    });

    carouselBtn.forEach(btn => btn.addEventListener('click', switchImage));
    window.addEventListener('load', loadImages);
}   
