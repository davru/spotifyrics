import { AppTheme } from "./enums";

export interface AppOptions {
  openInBrowser?: boolean;
  alwaysInTop?: boolean;
  coloredIcon?: boolean;
  theme?: AppTheme;
}

export interface SongInfo {
  name: string;
  title: string;
  artist: string;
  artwork: string;
  lyrics?: string;
}
