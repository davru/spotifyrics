import { app, Menu, nativeImage, shell, Tray } from 'electron';
import { setSync } from 'electron-settings';
import { join } from 'path';
import { cleanLyricsWindow, showLyrics } from './main';
import { AppTheme } from './utils/enums';
import { AppOptions } from './utils/interfaces';
import { next, playPause, previous } from './utils/spotify';
const assetsDir = join(__dirname, 'static');

// Refresh icon when MacOS dark/light theme has changed
// nativeTheme.on("updated", (isDark: boolean) => setTray(constructTray(getAppOptions(), isDark)));

export const constructTray = (options: AppOptions): Tray => {
	// Setup the menubar with an icon
	const image = nativeImage.createFromPath(`${assetsDir}/IconTemplate.png`);
	const trayIcon = image.resize({ width: 16, height: 16 });
	trayIcon.setTemplateImage(true);

	const tray = new Tray(trayIcon);

	updateTrayMenu(tray, options);

	return tray;
};

export const updateTrayMenu = (
	tray: Tray,
	options: AppOptions,
	open = false,
): void => {
	// Set tray context menu
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Show lyrics',
			click: () => showLyrics(),
		},
		{
			label: 'Controls',
			submenu: [
				{
					label: 'Play/pause',
					click: () => playPause(),
				},
				{
					label: 'Next',
					click: () => next(),
				},
				{
					label: 'Previous',
					click: () => previous(),
				},
			],
		},
		{ type: 'separator' },
		{
			label: 'Options',
			submenu: [
				{
					label: 'Open in Genius',
					toolTip: 'Check this option to open lyrics in your browser',
					type: 'checkbox',
					checked: options.openInBrowser,
					click: (e) => {
						options.openInBrowser = !options.openInBrowser;
						setSync('openInBrowser', options.openInBrowser);
						cleanLyricsWindow();
					},
				},
				{
					label: 'Always in top',
					type: 'checkbox',
					checked: options.alwaysInTop,
					click: (e) => {
						options.alwaysInTop = !options.alwaysInTop;
						setSync('alwaysInTop', options.alwaysInTop);
						cleanLyricsWindow();
						showLyrics();
					},
				},
				/*{
					label: 'Colored icon',
					type: 'checkbox',
					checked: options.coloredIcon,
					click: (e) => {
						options.coloredIcon = !options.coloredIcon;
						setSync('coloredIcon', options.coloredIcon);
						setTrayImage(options);
					},
				},*/
				{
					label: 'Theme',
					submenu: [
						{
							label: 'Dark theme',
							type: 'checkbox',
							checked: options.theme === 'dark',
							click: (e) => {
								options.theme = AppTheme.dark;
								setSync('theme', options.theme);
								cleanLyricsWindow();
								showLyrics();
							},
						},
						{
							label: 'Light theme',
							type: 'checkbox',
							checked: options.theme === 'light',
							click: (e) => {
								options.theme = AppTheme.light;
								setSync('theme', options.theme);
								cleanLyricsWindow();
								showLyrics();
							},
						},
					],
				},
			],
		},
		{
			label: 'Report issue',
			submenu: [
				{
					label: 'Write an email to contact@davru.dev',
					click: () =>
						shell.openExternal(
							'mailto:contact@davru.dev?subject=Report%20Spotifyrics%20issue',
						),
				},
			],
		},
		{
			label: 'Quit app',
			click: () => app.quit(),
		},
	]);

	tray.setContextMenu(contextMenu);
	if (open) {
		// tray.popUpContextMenu();
	}
};
