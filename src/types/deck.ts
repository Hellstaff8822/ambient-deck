export interface TimerState {
minutes: number;
  seconds: number;
  initialMinutes: number; 
  isActive: boolean;
  mode: "work" | "break";
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  fileUrl: string;
  coverUrl: string;
}

export const PLAYLIST: Track[] = [
  {
    id: "1",
    title: "Lounge Blue",
    artist: "vhskid.",
    fileUrl: "/audio/lounge-blue.mp3",
    coverUrl: "/images/vhskid.jpg",
  },
  {
    id: "2",
    title: "Hypnagogia",
    artist: "Nuit Polaire",
    fileUrl: "/audio/hypnagogia.mp3",
    coverUrl: "/images/hypno-cover.jpg",
  },
];

export interface AudioState {
  isPlaying: boolean;

  currentTrack: Track | null;
  playlist: Track[];

  volumes: {
    master: number;
    ambientRain: number;
    ambientFire: number;
  };
}
