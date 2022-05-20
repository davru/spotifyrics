import { shell } from "electron";
import { getOptions } from "../main";
import { AppOptions, SongInfo } from "./interfaces";
import { getTrackInfo } from "./spotify";

const geniusLyrics = require("genius-lyrics-api");

const apiKey =
  "ATVplshpcXTRddBTVeEt5lOyI3GlPKx-kRJUwm-iZWFdWXMNVQ4EAhgBoHDhCzJT";

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
  optimizeQuery?: true;
}

export function getLyrics(request: GeniusRequest): Promise<string> {
  request = {
    ...request,
    apiKey,
  };

  return geniusLyrics.getLyrics(request);
}

export function getSong(request: GeniusRequest): Promise<GeniusResult> {
  request = {
    ...request,
    apiKey,
  };

  return geniusLyrics.getSong(request);
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
        artist
      }).then((result) => {
        currentSong.lyrics = result;
      });
    }
  });

  return currentSong;
}
