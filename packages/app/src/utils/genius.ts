import { shell } from 'electron';
import { getOptions } from '../main';
import { AppOptions, SongInfo } from './interfaces';
import { getTrackInfo } from './spotify';

const geniusLyrics = require('genius-lyrics-api');

export interface GeniusResult {
	id: number;
	url: string;
	title: string;
	albumArt: string;
}

export interface GeniusRequest {
	apiKey?: string;
	title: string;
	artist: string;
}

export function getLyrics(request: GeniusRequest): Promise<string> {
	return geniusLyrics.getLyrics({
		...request,
		optimizeQuery: true,
		apiKey: process.env.GENIUS_API_KEY,
	});
}

export function getSong(request: GeniusRequest): Promise<GeniusResult> {
	return geniusLyrics.getSong({
		...request,
		optimizeQuery: true,
		apiKey: process.env.GENIUS_API_KEY,
	});
}

export async function getTrack(): Promise<SongInfo | null> {
	let currentSong: SongInfo = null;
	const options: AppOptions = getOptions();

	await getTrackInfo().then(async (track): Promise<void> => {
		const [artist, name, artworkUrl] = track;
		currentSong = {
			name: `${artist} - ${name}`,
			title: name,
			artist,
			artwork: artworkUrl,
		};

		if (!currentSong.title && !currentSong.artist) {
			return;
		}

		if (options.openInBrowser) {
			await getSong({
				title: name,
				artist,
			}).then((result) => {
				shell.openExternal(result.url);
			});

			return null;
		} else {
			await getLyrics({
				title: name,
				artist,
			}).then((result) => {
				currentSong.lyrics = result;
			});
		}
	});

	return currentSong;
}
