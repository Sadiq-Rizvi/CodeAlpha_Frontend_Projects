const songs = [];
let currentSongIndex = 0;
let isPlaying = false;

const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const songTitle = document.getElementById('song-title');
const artist = document.getElementById('artist');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeControl = document.getElementById('volume');
const playlistEl = document.getElementById('playlist');
const fileInput = document.getElementById('file-input');

function loadPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = `${song.title} - ${song.artist}`;
        li.classList.toggle('active', index === currentSongIndex);
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong();
            playSong();
        });
        playlistEl.appendChild(li);
    });
}

function loadSong() {
    if (songs.length === 0) {
        songTitle.textContent = 'Add songs to playlist';
        artist.textContent = 'Click + to add your music';
        return;
    }
    const song = songs[currentSongIndex];
    audio.src = song.src;
    songTitle.textContent = song.title;
    artist.textContent = song.artist;
    loadPlaylist();
    
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    }, { once: true });
}

function playSong() {
    if (songs.length === 0) return;
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    audio.play().catch(err => {
        console.error('Error playing audio:', err);
    });
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    audio.pause();
}

function nextSong() {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong();
    playSong();
}

function prevSong() {
    if (songs.length === 0) return;
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong();
    playSong();
}

function updateProgress(e) {
    if (!audio.duration) return;
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

function setProgress(e) {
    if (!audio.duration) return;
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function setVolume() {
    audio.volume = volumeControl.value / 100;
}

function handleFileUpload(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        songs.push({
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Your Music',
            src: url
        });
    }
    if (songs.length === files.length) {
        loadSong();
    }
    loadPlaylist();
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('click', setProgress);
volumeControl.addEventListener('input', setVolume);
audio.addEventListener('ended', nextSong);
audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
});
fileInput.addEventListener('change', handleFileUpload);

loadSong();
loadPlaylist();
setVolume();
