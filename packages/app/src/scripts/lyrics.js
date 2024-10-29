const { send, on } = window.electron;

send('update-theme');

function toggleLoading(loading) {
	document.getElementById('loader').style.display = loading ? 'block' : 'none';
	document.getElementById('window').style.display = loading ? 'none' : 'block';
}

on('updateSong', (_, response) => {
	document.getElementById('title').innerText = response.title;
	document.getElementById('artist').innerText = response.artist;
	document.getElementById('lyrics').innerText = response.lyrics;
	document.getElementById('bg-artwork').style.backgroundImage =
		`url(${response.artwork})`;

	send('update-status-control');
	toggleLoading(false);
});

on('updateTheme', (_, response) => {
	document.getElementsByTagName('body')[0].classList.remove('theme--light');
	document.getElementsByTagName('body')[0].classList.remove('theme--dark');
	document
		.getElementsByTagName('body')[0]
		.classList.add('theme--' + response.theme);
});

on('updateStateControl', (_, response) => {
	document.getElementById('status_control').innerText = response;
});

on('toggleLoader', (_, response) => {
	if (response) {
		document.getElementById('loader').style.display = 'block';
		document.getElementById('window').style.display = 'none';
	} else {
		document.getElementById('loader').style.display = 'none';
		document.getElementById('window').style.display = 'block';
	}
});

on('refresh', () => {
	toggleLoading(true);
	send('refresh');
});

document.addEventListener('DOMContentLoaded', () => {
	/* const n = new Notification('You did it!', {
        body: 'Spotifyrics is running'
    });*/
	send('load-song');

	document.getElementById('refresh').addEventListener('click', () => {
		toggleLoading(true);
		send('refresh');
	});

	document
		.getElementById('playControl')
		.addEventListener('click', () => send('play-control'));
	document
		.getElementById('previousControl')
		.addEventListener('click', () => send('previous-control'));
	document
		.getElementById('nextControl')
		.addEventListener('click', () => send('next-control'));

	setInterval(function _() {
		send('check-refresh');
	}, 10 * 1000);
});
