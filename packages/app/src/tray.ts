import { app, nativeImage, Tray, Menu, shell, nativeTheme } from "electron";
import { next, playPause, previous } from "./utils/spotify";
import { AppOptions } from "./utils/interfaces";
import { cleanLyricsWindow, getTray, showLyrics } from "./main";
import { join } from "path";
import { AppTheme } from "./utils/enums";
import { setSync } from 'electron-settings';
const assetsDir = join(__dirname, 'static');

// Refresh icon when MacOS dark/light theme has changed
// nativeTheme.on("updated", (isDark: boolean) => setTray(constructTray(getAppOptions(), isDark)));

const setTrayImage = (options: AppOptions): void => {
  const image = nativeImage.createFromPath(getTrayIcon(options));
  getTray().setImage(image.resize({ width: 16, height: 16 }));
  getTray().popUpContextMenu();
};

const getTrayIcon = (options: AppOptions, isDark = nativeTheme.shouldUseDarkColors): string => {
  return `${assetsDir}/IconTemplate_${options.coloredIcon ? 'c' : (isDark ? 'w' : 'd')}.png`;
};

export const constructTray = (options: AppOptions, isDark = nativeTheme.shouldUseDarkColors): Tray => {
  // Setup the menubar with an icon
  const image = nativeImage.createFromPath(getTrayIcon(options));
  const tray = new Tray(image.resize({ width: 16, height: 16 }));

  updateTrayMenu(tray, options);

  return tray;
};

export const updateTrayMenu = (tray: Tray, options: AppOptions, open = false): void =>  {
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
            setSync('openInBrowser', options.openInBrowser);
            cleanLyricsWindow();
          }
        },
        {
          label: "Always in top",
          type: "checkbox",
          checked: options.alwaysInTop,
          click: (e) => {
            options.alwaysInTop = !options.alwaysInTop;
            setSync('alwaysInTop', options.alwaysInTop);
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
            setSync('coloredIcon', options.coloredIcon);
            setTrayImage(options);
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
                setSync('theme', options.theme);
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
                setSync('theme', options.theme);
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
  if (open) {
    // tray.popUpContextMenu();
  }
}
