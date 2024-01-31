const musicBtn = document.querySelector('#music');
const musicIconOn = musicBtn?.querySelector('#music-icon-on') as HTMLElement | null;
const musicIconOff = musicBtn?.querySelector('#music-icon-off') as HTMLElement | null;

const soundBtn = document.querySelector('#sound');
const soundIconOn = soundBtn?.querySelector('#sound-icon-on') as HTMLElement | null;
const soundIconOff = soundBtn?.querySelector('#sound-icon-off') as HTMLElement | null;

const waveSoundBtn = document.querySelector('#wave-sound');
const waveSoundIconOn = waveSoundBtn?.querySelector('#wave-sound-icon-on') as HTMLElement | null;
const waveSoundIconOff = waveSoundBtn?.querySelector('#wave-sound-icon-off') as HTMLElement | null;

const activateAttackAudio:HTMLAudioElement = document.querySelector('#activate-audio')!;
const splashAudio:HTMLAudioElement = document.querySelector('#splash-audio')!;
const explosionAudio:HTMLAudioElement = document.querySelector('#explosion-audio')!;
const sunkAudio:HTMLAudioElement = document.querySelector('#sunk-audio')!;
const optimalAudio:HTMLAudioElement = document.querySelector('#optimal-audio')!;
const alertAudio:HTMLAudioElement = document.querySelector('#alert-audio')!;

activateAttackAudio.volume = 0.15;
splashAudio.volume = 0.2;
explosionAudio.volume = 0.8;
sunkAudio.volume = 0.7;

const led = document.querySelector('.led');

let musicIsActive = true;
let soundIsActive = true;
let wavesIsActive = true;

function toggleMusic() {
    musicIsActive = !musicIsActive;
    musicBtn?.setAttribute('data-active', musicIsActive.toString());
    
    if (musicIconOn && musicIconOff) {
        musicIconOn.style.display = musicIsActive ? 'inline' : 'none';
        musicIconOff.style.display = musicIsActive ? 'none' : 'inline';
    }
}

function toggleSound() {
    soundIsActive = !soundIsActive;
    soundBtn?.setAttribute('data-active', soundIsActive.toString());

    if (soundIconOn && soundIconOff) {
        soundIconOn.style.display = soundIsActive ? 'inline' : 'none';
        soundIconOff.style.display = soundIsActive? 'none' : 'inline';
    }
}

function toggleWaves() {
    wavesIsActive = !wavesIsActive;
    waveSoundBtn?.setAttribute('data-active', wavesIsActive.toString());

    if (waveSoundIconOn && waveSoundIconOff) {
        waveSoundIconOn.style.display = wavesIsActive? 'inline' : 'none';
        waveSoundIconOff.style.display = wavesIsActive? 'none' : 'inline';
    }
}

export function runActivateAudio() {
    void activateAttackAudio.play();
    activateAttackAudio.currentTime = 0;
}

export function runAttackAudio(state:string) {
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
    }
}

export const squareHitEffect = {
    runOptimal() {
        void optimalAudio.play();
        optimalAudio.currentTime = 0;
        led?.classList.add('optimal');
        setTimeout(() => {led?.classList.remove('optimal')}, 500);
    },

    runAlert() {
        void alertAudio.play();
        alertAudio.currentTime = 0;
        led?.classList.add('alert');
        setTimeout(() => { led?.classList.remove('alert') }, 500);
    }
}

musicBtn?.addEventListener('click', toggleMusic);
soundBtn?.addEventListener('click', toggleSound);
waveSoundBtn?.addEventListener('click', toggleWaves);
