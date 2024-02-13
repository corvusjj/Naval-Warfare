const musicBtn = document.querySelector('#music');
const musicIconOn = musicBtn?.querySelector('#music-icon-on') as HTMLElement | null;
const musicIconOff = musicBtn?.querySelector('#music-icon-off') as HTMLElement | null;

const soundBtn = document.querySelector('#sound');
const soundIconOn = soundBtn?.querySelector('#sound-icon-on') as HTMLElement | null;
const soundIconOff = soundBtn?.querySelector('#sound-icon-off') as HTMLElement | null;

const waveSoundBtn = document.querySelector('#wave-sound');
const waveSoundIconOn = waveSoundBtn?.querySelector('#wave-sound-icon-on') as HTMLElement | null;
const waveSoundIconOff = waveSoundBtn?.querySelector('#wave-sound-icon-off') as HTMLElement | null;

const backgroundMusic:HTMLAudioElement = document.querySelector('#background-music')!;
const wavesAudio:HTMLAudioElement = document.querySelector('#waves-audio')!;

const activateAttackAudio:HTMLAudioElement = document.querySelector('#activate-audio')!;
const splashAudio:HTMLAudioElement = document.querySelector('#splash-audio')!;
const explosionAudio:HTMLAudioElement = document.querySelector('#explosion-audio')!;
const sunkAudio:HTMLAudioElement = document.querySelector('#sunk-audio')!;
const optimalAudio:HTMLAudioElement = document.querySelector('#optimal-audio')!;
const alertAudio:HTMLAudioElement = document.querySelector('#alert-audio')!;
const morseAudio:HTMLAudioElement = document.querySelector('#morse-audio')!;

backgroundMusic.volume = 0.2;
wavesAudio.volume = 0.7;

activateAttackAudio.volume = 0.3;
splashAudio.volume = 0.2;
explosionAudio.volume = 0.5;
sunkAudio.volume = 0.3;
optimalAudio.volume = 0.3;
alertAudio.volume = 0.2;
morseAudio.volume = 0.3;

const led = document.querySelector('.led');

let musicIsActive = true;
let soundIsActive = true;
let wavesIsActive = true;

interface AudioStates {
    musicIsActive: boolean;
    soundIsActive: boolean;
    wavesIsActive: boolean;
}

function saveAudioStates() {
    const audioStates = { musicIsActive, soundIsActive, wavesIsActive }
    window.localStorage.setItem('bs-audio-states', JSON.stringify(audioStates));
}

function retrieveAudioStates() {
    const audioStatesJSON:string | null = window.localStorage.getItem('bs-audio-states');

    if (audioStatesJSON !== null) {
        const audioStates = JSON.parse(audioStatesJSON) as AudioStates;
        if (!audioStates.musicIsActive) toggleMusic();
        if (!audioStates.soundIsActive) toggleSound();
        if (!audioStates.wavesIsActive) toggleWaves();
    } else {
        saveAudioStates();
    }
}

function toggleMusic() {
    musicIsActive = !musicIsActive;
    musicBtn?.setAttribute('data-active', musicIsActive.toString());
    
    if (musicIconOn && musicIconOff) {
        musicIconOn.style.display = musicIsActive ? 'inline' : 'none';
        musicIconOff.style.display = musicIsActive ? 'none' : 'inline';
    }

    musicIsActive? void backgroundMusic.play(): backgroundMusic.pause();
    saveAudioStates();
}

function toggleSound() {
    soundIsActive = !soundIsActive;
    soundBtn?.setAttribute('data-active', soundIsActive.toString());

    if (soundIconOn && soundIconOff) {
        soundIconOn.style.display = soundIsActive ? 'inline' : 'none';
        soundIconOff.style.display = soundIsActive? 'none' : 'inline';
    }

    saveAudioStates();
}

function toggleWaves() {
    wavesIsActive = !wavesIsActive;
    waveSoundBtn?.setAttribute('data-active', wavesIsActive.toString());

    if (waveSoundIconOn && waveSoundIconOff) {
        waveSoundIconOn.style.display = wavesIsActive? 'inline' : 'none';
        waveSoundIconOff.style.display = wavesIsActive? 'none' : 'inline';
    }

    wavesIsActive? void wavesAudio.play(): wavesAudio.pause();
    saveAudioStates();
}

export function runActivateAudio() {
    if (!soundIsActive) return;
    void activateAttackAudio.play();
    activateAttackAudio.currentTime = 0;
}

export function runAttackAudio(state:string) {
    if (!soundIsActive) return;
    switch(state) {
        case 'miss':
            void splashAudio.play();
            splashAudio.currentTime = 0;
            break;
        case 'hit':
            void explosionAudio.play();
            explosionAudio.currentTime = 0;
            break;
        case 'sunk':
            void sunkAudio.play();
            sunkAudio.currentTime = 0;
            break;
        case 'game-over':
            void sunkAudio.play();
            sunkAudio.currentTime = 0;
            break;
    }
}

export const squareHitEffect = {
    runOptimal() {
        led?.classList.add('optimal');
        setTimeout(() => {led?.classList.remove('optimal')}, 500);

        if (!soundIsActive) return;
        void optimalAudio.play();
        optimalAudio.currentTime = 0;
    },

    runAlert() {
        led?.classList.add('alert');
        setTimeout(() => { led?.classList.remove('alert') }, 500);

        if (!soundIsActive) return;
        void alertAudio.play();
        alertAudio.currentTime = 0;
    }
}

export function handleGameOverAudio() {
    backgroundMusic.volume = 0;
    setTimeout(() => void morseAudio.play(), 1200);
}

musicBtn?.addEventListener('click', toggleMusic);
soundBtn?.addEventListener('click', toggleSound);
waveSoundBtn?.addEventListener('click', toggleWaves);

export function audioInit() {
    retrieveAudioStates();
    if (musicIsActive) void backgroundMusic.play();
    if (wavesIsActive) void wavesAudio.play();
}
