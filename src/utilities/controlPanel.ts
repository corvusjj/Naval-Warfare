const musicBtn = document.querySelector('#music');
const musicIconOn = musicBtn?.querySelector('#music-icon-on') as HTMLElement | null;
const musicIconOff = musicBtn?.querySelector('#music-icon-off') as HTMLElement | null;

const soundBtn = document.querySelector('#sound');
const soundIconOn = soundBtn?.querySelector('#sound-icon-on') as HTMLElement | null;
const soundIconOff = soundBtn?.querySelector('#sound-icon-off') as HTMLElement | null;

let musicIsActive = true;
let soundIsActive = true;

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

musicBtn?.addEventListener('click', toggleMusic);
soundBtn?.addEventListener('click', toggleSound);
