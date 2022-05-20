import { app, nativeImage, Tray, Menu, shell } from "electron";
import { next, playPause, previous } from "./utils/spotify";
import { AppOptions } from "./utils/interfaces";
import { cleanLyricsWindow, getTray, showLyrics } from "./main";
import { nativeTheme } from "electron"
import * as path from "path";
import { AppTheme } from "./utils/enums";

const storage = require('electron-json-storage');
const assetsDir = path.join(__dirname, 'static');

// Refresh icon when MacOS dark/light theme has changed
// nativeTheme.on("updated", (isDark: boolean) => setTray(constructTray(getAppOptions(), isDark)));

export const setTrayImage = (imagePath: string): void => {
  const image = nativeImage.createFromPath(imagePath);
  getTray().setImage(image.resize({ width: 16, height: 16 }));
};

export const constructTray = (options: AppOptions, isDark = nativeTheme.shouldUseDarkColors): Tray => {
  // Setup the menubar with an icon
  const image = nativeImage.createFromPath(`${assetsDir}/IconTemplate_${options.coloredIcon ? 'c' : 'd'}.png`);
  const tray = new Tray(image.resize({ width: 16, height: 16 }));

  updateTrayMenu(tray, options);

  return tray;
};

export const updateTrayMenu = (tray: Tray, options: AppOptions): void =>  {
  // Set tray context menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show lyrics",
      click: () => showLyrics(),
    },
    {
      label: "Controls",
      submenu: [
        {
          label: "Play/pause",
          click: (e) => playPause(),
        },
        {
          label: "Next",
          click: (e) => next(),
        },
        {
          label: "Previous",
          click: (e) => previous(),
        }
      ],
    },
    { type: "separator" },
    {
      label: "Options",
      submenu: [
        {
          label: "Open in Genius",
          toolTip: "Check this option to open lyrics in your browser",
          type: "checkbox",
          checked: options.openInBrowser,
          click: (e) => {
            options.openInBrowser = !options.openInBrowser;
            storage.set('options.openInBrowser', options.openInBrowser);
            cleanLyricsWindow();
          }
        },
        {
          label: "Always in top",
          type: "checkbox",
          checked: options.alwaysInTop,
          click: (e) => {
            options.alwaysInTop = !options.alwaysInTop;
            storage.set('options.alwaysInTop', options.alwaysInTop);
            cleanLyricsWindow();
            showLyrics();
          }
        },
        {
          label: "Colored icon",
          type: "checkbox",
          checked: options.coloredIcon,
          click: (e) => {
            options.coloredIcon = !options.coloredIcon;
            storage.set('options.coloredIcon', options.coloredIcon);

            setTrayImage(`${assetsDir}/IconTemplate_${options.coloredIcon ? 'c' : 'd'}.png`);
          }
        },
        {
          label: "Theme",
          submenu: [
            {
              label: "Dark theme",
              type: "checkbox",
              checked: options.theme === 'dark',
              click: (e) => {
                options.theme = AppTheme.dark;
                storage.set('options.theme', options.theme);
                cleanLyricsWindow();
                showLyrics();
              }
            },
            {
              label: "Light theme",
              type: "checkbox",
              checked: options.theme === 'light',
              click: (e) => {
                options.theme = AppTheme.light;
                storage.set('options.theme', options.theme);
                cleanLyricsWindow();
                showLyrics();
              }
            }
          ]
        }
      ],
    },
    {
      label: "Report issue",
      submenu: [
        {
          label: "Write an email to contact@dsgdsr.me",
          click: () => shell.openExternal("mailto:contact@dsgdsr.me?subject=Report%20Spotifyrics%20issue")
        }
      ]
    },
    {
      label: "Quit app",
      click: () => app.quit()
    },
  ]);

  tray.setContextMenu(contextMenu);
}
