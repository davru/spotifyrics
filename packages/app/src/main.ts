import {
  app,
  BrowserWindow,
  Tray,
  Notification
} from "electron";
import { getIsRunning, getTrackInfo } from './utils/spotify';
import { getLyrics, getTrack } from './utils/genius';
import { constructTray, updateTrayMenu } from "./tray";
import { loadIpcProcesses } from "./ipc";
import { AppOptions, SongInfo } from "./utils/interfaces";
import { AppTheme } from "./utils/enums";
import { getSync } from 'electron-settings';

let tray: Tray;
let lyricsWindow: BrowserWindow;
let currentSong: SongInfo;
const options: AppOptions = {
  alwaysInTop: (typeof getSync('alwaysInTop') === 'boolean')
    ? getSync('alwaysInTop') as boolean : false,
  openInBrowser: (typeof getSync('openInBrowser') === 'boolean')
    ? getSync('openInBrowser') as boolean : false,
  coloredIcon: (typeof getSync('coloredIcon') === 'boolean')
    ? getSync('coloredIcon') as boolean : false,
  theme: (typeof getSync('theme') === 'string') ? getSync('theme') as AppTheme : AppTheme.dark
};

export const getTray = (): Tray => tray;
export const getOptions = (): AppOptions => options;
export const getCurrentSong = (): SongInfo => currentSong;
export const updateCurrentSong = (song: SongInfo) => currentSong = song;

export async function refreshSong(): Promise<void> {
  await getTrackInfo().then((track): void => {
    const [artist, name, artworkUrl] = track;
    currentSong = {
      name: `${artist} - ${name}`,
      title: name,
      artist,
      artwork: artworkUrl
    };
  });

  await getLyrics({
    title: currentSong.name,
    artist: currentSong.artist
  }).then(result => {
    currentSong.lyrics = result;
  });
};

export const cleanLyricsWindow = () => {
  if (lyricsWindow) {
    if (!lyricsWindow.isDestroyed() && lyricsWindow.isEnabled()) {
      lyricsWindow.close();
      lyricsWindow.destroy();
      lyricsWindow = undefined;
      updateTrayMenu(tray, options);
    } else {
      lyricsWindow = undefined;
    }
  }
};

export const showLyrics = async () => {
  const isSpotifyRunning = await getIsRunning();
  if (!isSpotifyRunning) {
    new Notification({
      title: 'Error 🔇',
      body: '\nSpotify app is not running, opening a new instance for you ;)'
    }).show();
    return;
  }

  if (!options.openInBrowser) {
    if (lyricsWindow) {
      if (!lyricsWindow.isDestroyed() && lyricsWindow.isEnabled()) {
        lyricsWindow.show();
        return;
      } else {
        lyricsWindow = undefined;
      }
    }

    lyricsWindow = new BrowserWindow({
      frame: true,
      title: 'asd', // song details
      transparent: false,
      resizable: false,
      hasShadow: false,
      alwaysOnTop: options.alwaysInTop,
      closable: true,
      minimizable: true,
      maximizable: false,
      show: false,
      fullscreenable: false,
      movable: true,
      webPreferences: {
        backgroundThrottling: false,
        nodeIntegration: true
      }
    });

    lyricsWindow.on('blur', () => {
      if (!options.alwaysInTop) {
        lyricsWindow.minimize();
      }
    });

    lyricsWindow.webContents.on('did-finish-load', () => {
      lyricsWindow.show();
    });

    lyricsWindow.loadFile(`${process.env.NODE_ENV === 'development' ? '' : 'dist/'}templates/lyrics.html`);
  }

  getTrack().then((track: SongInfo | null): void => {
    if (!!track) {
      currentSong = track;
      if (process.env.NODE_ENV === 'development') {
        lyricsWindow.webContents.openDevTools();
      }
    }
  }).catch((error) => error);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", () => {
  // Setup the menubar with an icon
  tray = constructTray(options);

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    // if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

loadIpcProcesses();
