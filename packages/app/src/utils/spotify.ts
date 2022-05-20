import * as execa from 'execa';
import { Notification } from "electron";

export interface TrackInfo {
    artist: string
    artworkUrl: string
    name: string
}

async function getArtist(): Promise<string> {
    try {
        const { stdout: artist } = await execa('osascript', [
            '-e',
            'tell application "Spotify" to return current track\'s artist',
        ])
        return artist;
    } catch (error) {
        return null;
    }
}

async function getArtworkUrl(): Promise<string> {
    try {
        const { stdout: artworkUrl } = await execa('osascript', [
            '-e',
            'tell application "Spotify" to return current track\'s artwork url',
        ])
        return artworkUrl;
    } catch (error) {
        return null;
    }
}

export async function getName(): Promise<string> {
    try {
        const { stdout: name } = await execa('osascript', [
            '-e',
            'tell application "Spotify" to return current track\'s name',
        ])
        return name;
    } catch (error) {
        return null;
    }
}

export async function getTrackInfo(): Promise<any> {
    return Promise.all([
        getArtist(),
        getName(),
        getArtworkUrl(),
    ]);
}

export type SpotifyPlayingState = 'playing' | 'paused' | 'stopped'

export async function getPlayerState(): Promise<SpotifyPlayingState> {
    const { stdout } = await execa('osascript', [
        '-e',
        'tell application "Spotify" to return player state',
    ])
    if (String(stdout) === 'playing') return 'playing'
    if (String(stdout) === 'paused') return 'paused'
    return 'stopped'
}

export async function getIsRunning(): Promise<boolean> {
    try {
        const { stdout } = await execa('osascript', [
            '-e',
            'tell application "System Events" to (name of processes) contains "Spotify"',
        ])
        return stdout === 'true'
    } catch (error) {
        const isSpotifyRunning = await getIsRunning();
        if (!isSpotifyRunning) {
            new Notification({
                title: 'Error',
                body: '\nSpotify app is not running,'
            }).show();
            return null;
        }
    }
}

export async function playPause(): Promise<void> {
    await execa('osascript', ['-e', 'tell application "Spotify" to playpause'])
}

export async function next(): Promise<void> {
    await execa('osascript', ['-e', 'tell application "Spotify" to next track'])
}

export async function previous(): Promise<void> {
    await execa('osascript', [
        '-e',
        'tell application "Spotify" to previous track',
    ])
}