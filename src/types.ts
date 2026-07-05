export interface Move {
  name: string;
  type: string;
  power: number;
  accuracy: number;
  description: string;
}

export interface PokemonBase {
  id: number;
  name: string;
  type: "Grass" | "Fire" | "Water" | "Normal" | "Electric" | "Psychic" | "Fighting" | "Ghost";
  maxHp: number;
  level: number;
  attack: number;
  defense: number;
  speed: number;
  moves: Move[];
}

export interface BattlePokemon extends PokemonBase {
  currentHp: number;
  status?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  codeUrl: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  category: string;
}

export interface SkillItem {
  name: string;
  level: number; // 1-10 scale
  category: "frontend" | "backend" | "database" | "api";
}

export interface Trainer {
  username: string;
  wins: number;
  losses: number;
  stage: number;
  team: number[]; // Store Pokemon database IDs
}

export interface BattleLog {
  id: string;
  text: string;
  type: "info" | "damage" | "heal" | "status" | "win" | "lose";
}
