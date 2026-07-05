export interface Track {
  id: string;
  name: string;
  url: string;
  genre: "Relaxing" | "Adventure" | "Battle" | "Spooky";
}

export const TRACKS: Track[] = [
  {
    id: "gsc-route29",
    name: "Route 29 Theme (GSC)",
    url: "https://play.pokemonshowdown.com/audio/music/gsc-route29.mp3",
    genre: "Adventure"
  },
  {
    id: "gsc-trainerbattle",
    name: "Trainer Battle (GSC)",
    url: "https://play.pokemonshowdown.com/audio/music/gsc-trainerbattle.mp3",
    genre: "Battle"
  },
  {
    id: "rby-gym",
    name: "Gym Leader (RBY)",
    url: "https://play.pokemonshowdown.com/audio/music/rby-gym.mp3",
    genre: "Battle"
  },
  {
    id: "gsc-pkmncenter",
    name: "Pokémon Center (GSC)",
    url: "https://play.pokemonshowdown.com/audio/music/gsc-pkmncenter.mp3",
    genre: "Relaxing"
  },
  {
    id: "gsc-wildbattle",
    name: "Wild Pokémon (GSC)",
    url: "https://play.pokemonshowdown.com/audio/music/gsc-wildbattle.mp3",
    genre: "Battle"
  }
];
