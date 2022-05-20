const { ipcRenderer } = require('electron');

ipcRenderer.send('resize-window', 400, 600);
ipcRenderer.send('update-theme');

function toggleLoading(loading) {
    document.getElementById('loader').style.display = loading ? 'block' : 'none';
    document.getElementById('window').style.display = loading ? 'none' : 'block';
}

ipcRenderer.on('updateSong', (event, response) => {
    document.getElementById('title').innerText = response.title;
    document.getElementById('artist').innerText = response.artist;
    document.getElementById('lyrics').innerText = response.lyrics;
    document.getElementById('bg-artwork').style.backgroundImage = `url(${response.artwork})`;

    ipcRenderer.send('update-status-control');
    toggleLoading(false);
});

ipcRenderer.on('updateTheme', (event, response) => {
    document.getElementsByTagName('body')[0].classList.remove('theme--light');
    document.getElementsByTagName('body')[0].classList.remove('theme--dark');
    document.getElementsByTagName('body')[0].classList.add('theme--' + response.theme);
});

ipcRenderer.on('updateStateControl', (event, response) => {
    document.getElementById('status_control').innerText = response;
});

ipcRenderer.on('toggleLoader', (event, response) => {
    if (response) {
        document.getElementById('loader').style.display = 'block';
        document.getElementById('window').style.display = 'none';
    } else {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('window').style.display = 'block';
    }
});

ipcRenderer.on('refresh', (event, response) => {
    toggleLoading(true);
    ipcRenderer.send('refresh');
});

document.addEventListener('DOMContentLoaded', () => {
    /* const n = new Notification('You did it!', {
        body: 'Spotifyrics is running'
    });*/
    ipcRenderer.send('load-song');

    document.getElementById('refresh').addEventListener('click', () => {
        toggleLoading(true);
        ipcRenderer.send('refresh');
    });

    document.getElementById('playControl').addEventListener('click', () => ipcRenderer.send('play-control'));
    document.getElementById('previousControl').addEventListener('click', () => ipcRenderer.send('previous-control'));
    document.getElementById('nextControl').addEventListener('click', () => ipcRenderer.send('next-control'));

    setInterval(function _() {
        ipcRenderer.send('check-refresh');
    }, 10 * 1000);
});