import { BrowserWindow, ipcMain, dialog } from "electron";
import {
  cleanLyricsWindow,
  getCurrentSong,
  getOptions,
  refreshSong,
  updateCurrentSong
} from "./main";
import { getTrack } from "./utils/genius";
import { SongInfo } from "./utils/interfaces";
import {
  getIsRunning,
  getName,
  getPlayerState,
  next,
  playPause,
  previous
} from "./utils/spotify";

const refresh = async (event: any) => {
  await refreshSong();
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  const currentSong = getCurrentSong();
  const options = getOptions();

  browserWindow.setTitle(currentSong.title);
  event.sender.send('updateSong', currentSong);
  event.sender.send('updateTheme', options);
  event.sender.send('toggleLoader', false);
}

export const loadIpcProcesses = () => {
  ipcMain.on('load-song', (event) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender);
    const currentSong = getCurrentSong();
    const options = getOptions();

    if (!currentSong || (!currentSong?.artist && !currentSong?.title)) {
      getTrack().then((track: SongInfo | null): void => {
        updateCurrentSong(track);
        browserWindow.setTitle(track.title);
        event.sender.send('updateSong', track);
        event.sender.send('updateTheme', options);
      }).catch(error => {
        dialog.showErrorBox('No track found playing, please try again after queuing some music', '');
        cleanLyricsWindow();
      });
    } else {
      browserWindow.setTitle(currentSong.title);
      event.sender.send('updateSong', currentSong);
      event.sender.send('updateTheme', options);
    }
  });

  ipcMain.on('refresh', async (event) => refresh(event));
  ipcMain.on('check-refresh', async (event) => {
    const currentSong = getCurrentSong();
    getName().then(name => {
      if (name !== currentSong?.title && getIsRunning()) {
        refresh(event);
      }
    });
  });

  ipcMain.on('resize-window', (event, width, height) => {
    const browserWindow = BrowserWindow.fromWebContents(event.sender);
    browserWindow.setSize(width, height);
  });

  ipcMain.on('play-control', async (event) => {
    const status = (await getPlayerState()).toString();
    playPause();
    event.sender.send('updateStateControl', status === 'playing' ? 'play_arrow' : 'pause');
  });

  ipcMain.on('previous-control', async (event) => {
    const song = getCurrentSong();
    event.sender.send('toggleLoader', true);
    await previous();
    if (getCurrentSong().name === song.name) {
      await previous();
    }
    refresh(event);
  });

  ipcMain.on('next-control', async (event) => {
    event.sender.send('toggleLoader', true);
    await next();
    refresh(event);
  });

  ipcMain.on('update-theme', async (event) => {
    const options = getOptions();
    event.sender.send('updateTheme', options);
  });

  ipcMain.on('update-status-control', async (event) => {
    const status = (await getPlayerState()).toString();
    event.sender.send('updateStateControl', status === 'playing' ? 'pause' : 'play_arrow');
  });
};
