import { PokemonBase, Project, Certificate, SkillItem } from "./types";

// Professional Skills
export const SKILLS: SkillItem[] = [
  // FRONTEND
  { name: "React", level: 9, category: "frontend" },
  { name: "Next.js", level: 8, category: "frontend" },
  { name: "Vite", level: 9, category: "frontend" },
  { name: "Javascript", level: 9, category: "frontend" },
  { name: "Typescript", level: 8, category: "frontend" },
  { name: "Tailwind CSS", level: 9, category: "frontend" },

  // BACKEND
  { name: "Node.js", level: 8, category: "backend" },
  { name: "Express.js", level: 8, category: "backend" },
  { name: "PHP", level: 8, category: "backend" },
  { name: "Laravel", level: 8, category: "backend" },
  { name: "Java", level: 7, category: "backend" },

  // DATABASE & TOOLS
  { name: "PostgreSQL", level: 8, category: "database" },
  { name: "MongoDB", level: 7, category: "database" },
  { name: "MySQL", level: 9, category: "database" },
  { name: "Git & GitHub", level: 9, category: "database" },
  { name: "Docker", level: 7, category: "database" },

  // APIS & INTEGRATIONS
  { name: "RESTful APIs", level: 9, category: "api" },
  { name: "Firebase & Auth", level: 8, category: "api" },
  { name: "Google Maps API", level: 8, category: "api" },
  { name: "Midtrans Payment Gateway", level: 8, category: "api" }
];

// Pokédex Projects
export const PROJECTS: Project[] = [
  {
    id: "proj1",
    title: "IT Support System, Website Development for customer",
    description: "Developed and implemented property management and IT support system for a client, streamlining their operations and enhancing customer service efficiency.",
    image: "https://cdn.phototourl.com/free/2026-06-28-22c2d998-9274-448d-aa8f-2daafa43ec64.jpg",
    tags: ["React", "JavaScript", "PostgreSQL"],
    demoUrl: "#",
    codeUrl: "#"
  },
  {
    id: "proj2",
    title: "Staff IT in Pharmacy Parakan",
    description: "Managed pharmacy data using Excel, MySQL, and Python by maintaning medicine records, updating inventory information, ensuring data accruracy, and supporting daily pharmacy operations through efficient database management and IT Support.",
    image: "https://cdn.phototourl.com/free/2026-06-28-466cc5cd-12b2-4db3-b9d9-3b13d102b381.jpg",
    tags: ["Excel", "MySQL", "Python"],
    demoUrl: "#",
    codeUrl: "#"
  },
  // {
  //   id: "proj3",
  //   title: "Nama Coffee",
  //   description: "E-Commerce and company profile website with interactive menu navigation and automated WhatsApp checkout for Nama Coffee shop.",
  //   image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=60",
  //   tags: ["Vite", "Tailwind CSS", "WhatsApp API"],
  //   demoUrl: "#",
  //   codeUrl: "#"
  // },
  // {
  //   id: "proj4",
  //   title: "PokéDex Portfolio Engine",
  //   description: "A gorgeous retro GameBoy emulator style portfolio combining standard resumes with direct interactive elements of a real Pokémon battle emulator.",
  //   image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&auto=format&fit=crop&q=60",
  //   tags: ["Vite", "React", "TypeScript", "Motion"],
  //   demoUrl: "#",
  //   codeUrl: "#"
  // }
];

// Hall of Fame Certificates
export const CERTIFICATES: Certificate[] = [
  {
    id: "cert1",
    title: "E-Certificate of Intership",
    issuer: "PT DIGITAL HASANAH INDONESIA",
    date: "Januari 2024 - Maret 2024",
    image: "https://www.image2url.com/r2/default/images/1782639799362-f34124b9-849d-4737-b672-b798f5b8dc60.jpeg",
    category: "PT DIGITAL HASANAH INDONESIA"
  },
  {
    id: "cert2",
    title: "Introduction to UI/UX Design",
    issuer: "Myskill Academy",
    date: "Mei 2023",
    image: "https://www.image2url.com/r2/default/images/1782635542453-91954d3f-e5b0-4955-b151-8b65f5d997f7.jpeg",
    category: "Myskill Academy"
  },
  {
    id: "cert3",
    title: "Introduction to Data Analysis",
    issuer: "Myskill Academy",
    date: "Mei 2023",
    image: "https://cdn.phototourl.com/free/2026-06-28-a44d8b71-ffb1-4920-9f15-8501bcf05d53.jpg",
    category: "Myskill Academy"
  },
  {
    id: "cert4",
    title: "Introduction to Graphic Design Principles",
    issuer: "Myskill Academy",
    date: "Mei 2023",
    image: "https://cdn.phototourl.com/free/2026-06-28-1cc27cc6-f270-486e-877f-de8cebbf12ca.jpg",
    category: "Myskill Academy"
  },
   {
    id: "cert5",
    title: "Introduction to Backend Engineering",
    issuer: "Myskill Academy",
    date: "December 2024",
    image: "https://cdn.phototourl.com/free/2026-06-28-5e208754-028c-44f5-85ab-5c23e1aeed5d.jpg",
    category: "Myskill Academy"
  },
  {
    id: "cert6",
    title: "Introduction to Digital Marketing",
    issuer: "RevoU",
    date: "Mei 2023",
    image: "https://cdn.phototourl.com/free/2026-06-28-4971dc95-ec5e-4336-ad5a-6067893fb7bb.jpg",
    category: "RevoU"
  }
];

// Pokemon Database for Battle Game
export const POKEMON_DB: PokemonBase[] = [
  {
    id: 1,
    name: "Bulbasaur",
    type: "Grass",
    maxHp: 100,
    level: 5,
    attack: 49,
    defense: 49,
    speed: 45,
    moves: [
      { name: "Tackle", type: "Normal", power: 35, accuracy: 95, description: "Charges target with full body force." },
      { name: "Vine Whip", type: "Grass", power: 45, accuracy: 100, description: "Strikes target with thin whips." },
      { name: "Razor Leaf", type: "Grass", power: 55, accuracy: 95, description: "Sharp leaves slash the target." },
      { name: "Synthesize", type: "Grass", power: -30, accuracy: 100, description: "Heals self by absorbing sunlight." } // negative power implies healing
    ]
  },
  {
    id: 4,
    name: "Charmander",
    type: "Fire",
    maxHp: 100,
    level: 5,
    attack: 52,
    defense: 43,
    speed: 65,
    moves: [
      { name: "Scratch", type: "Normal", power: 35, accuracy: 100, description: "Scratches target with sharp claws." },
      { name: "Ember", type: "Fire", power: 40, accuracy: 100, description: "Fires small embers at the target." },
      { name: "Flame Burst", type: "Fire", power: 55, accuracy: 95, description: "Burst of fire engulfs the target." },
      { name: "Dragon Rage", type: "Normal", power: 40, accuracy: 100, description: "Deals fixed legendary damage." }
    ]
  },
  {
    id: 7,
    name: "Squirtle",
    type: "Water",
    maxHp: 100,
    level: 5,
    attack: 48,
    defense: 65,
    speed: 43,
    moves: [
      { name: "Tackle", type: "Normal", power: 35, accuracy: 95, description: "Charges target with full body force." },
      { name: "Water Gun", type: "Water", power: 40, accuracy: 100, description: "Squirts a jet of water at target." },
      { name: "Bubble Beam", type: "Water", power: 55, accuracy: 95, description: "Fires bubbles that reduce speed." },
      { name: "Shell Retract", type: "Water", power: -25, accuracy: 100, description: "Withdraws in shell to restore HP." }
    ]
  },
  {
    id: 25,
    name: "Pikachu",
    type: "Electric",
    maxHp: 100,
    level: 5,
    attack: 55,
    defense: 40,
    speed: 90,
    moves: [
      { name: "Quick Attack", type: "Normal", power: 35, accuracy: 100, description: "Extremely fast strike that hits first." },
      { name: "Thunder Shock", type: "Electric", power: 40, accuracy: 100, description: "Zaps target with static sparks." },
      { name: "Thunderbolt", type: "Electric", power: 60, accuracy: 95, description: "Strong electric bolt strikes target." },
      { name: "Tail Whip", type: "Normal", power: 40, accuracy: 100, description: "Flares cuteness to lower defense." }
    ]
  },
  {
    id: 133,
    name: "Eevee",
    type: "Normal",
    maxHp: 100,
    level: 5,
    attack: 55,
    defense: 50,
    speed: 55,
    moves: [
      { name: "Tackle", type: "Normal", power: 35, accuracy: 95, description: "Charges target with full body force." },
      { name: "Bite", type: "Normal", power: 45, accuracy: 100, description: "Bites target with sharp teeth." },
      { name: "Swift", type: "Normal", power: 50, accuracy: 100, description: "Shoots star-shaped rays that never miss." },
      { name: "Covet", type: "Normal", power: -20, accuracy: 100, description: "Acts cute to steal HP." }
    ]
  },
  {
    id: 52,
    name: "Meowth",
    type: "Normal",
    maxHp: 100,
    level: 5,
    attack: 45,
    defense: 35,
    speed: 90,
    moves: [
      { name: "Scratch", type: "Normal", power: 35, accuracy: 100, description: "Scratches target with sharp claws." },
      { name: "Bite", type: "Normal", power: 45, accuracy: 100, description: "Bites target with sharp teeth." },
      { name: "Pay Day", type: "Normal", power: 40, accuracy: 100, description: "Throws shiny coins to damage and heal 10HP." },
      { name: "Fury Swipes", type: "Normal", power: 55, accuracy: 80, description: "Swipes claws rapidly to strike." }
    ]
  },
  {
    id: 54,
    name: "Psyduck",
    type: "Water",
    maxHp: 100,
    level: 5,
    attack: 52,
    defense: 48,
    speed: 55,
    moves: [
      { name: "Scratch", type: "Normal", power: 35, accuracy: 100, description: "Scratches target with sharp claws." },
      { name: "Water Pulse", type: "Water", power: 45, accuracy: 100, description: "Ultrasonic waves that burst." },
      { name: "Confusion", type: "Psychic", power: 50, accuracy: 100, description: "A psychic telekinetic strike." },
      { name: "Headache", type: "Psychic", power: -25, accuracy: 100, description: "Clutches head to relieve HP loss." }
    ]
  }
];

// Special/Wild Enemy Pokemons for Boss/Stages
export const ENEMY_POKEMON_DB: PokemonBase[] = [
  {
    id: 16,
    name: "Pidgey",
    type: "Normal",
    maxHp: 85,
    level: 3,
    attack: 45,
    defense: 40,
    speed: 56,
    moves: [
      { name: "Tackle", type: "Normal", power: 35, accuracy: 95, description: "Tackles target." },
      { name: "Gust", type: "Normal", power: 40, accuracy: 100, description: "Blows wind." }
    ]
  },
  {
    id: 19,
    name: "Rattata",
    type: "Normal",
    maxHp: 80,
    level: 3,
    attack: 56,
    defense: 35,
    speed: 72,
    moves: [
      { name: "Tackle", type: "Normal", power: 35, accuracy: 95, description: "Tackles target." },
      { name: "Quick Attack", type: "Normal", power: 40, accuracy: 100, description: "Strikes first." }
    ]
  },
  {
    id: 10,
    name: "Caterpie",
    type: "Grass",
    maxHp: 75,
    level: 3,
    attack: 30,
    defense: 35,
    speed: 45,
    moves: [
      { name: "Tackle", type: "Normal", power: 30, accuracy: 100, description: "Small ram." },
      { name: "Bug Bite", type: "Grass", power: 40, accuracy: 95, description: "Bites." }
    ]
  },
  {
    id: 143,
    name: "Snorlax",
    type: "Normal",
    maxHp: 130,
    level: 8,
    attack: 65,
    defense: 65,
    speed: 30,
    moves: [
      { name: "Body Slam", type: "Normal", power: 60, accuracy: 100, description: "Slams body." },
      { name: "Crunch", type: "Normal", power: 55, accuracy: 95, description: "Bites hard." }
    ]
  },
  {
    id: 94,
    name: "Gengar",
    type: "Ghost",
    maxHp: 110,
    level: 10,
    attack: 70,
    defense: 50,
    speed: 110,
    moves: [
      { name: "Shadow Ball", type: "Ghost", power: 60, accuracy: 100, description: "Fires shadow sphere." },
      { name: "Dark Pulse", type: "Ghost", power: 55, accuracy: 95, description: "Dark energy pulse." }
    ]
  },
  {
    id: 6,
    name: "Charizard",
    type: "Fire",
    maxHp: 150,
    level: 12,
    attack: 84,
    defense: 78,
    speed: 100,
    moves: [
      { name: "Flamethrower", type: "Fire", power: 75, accuracy: 100, description: "Fires massive flame." },
      { name: "Slash", type: "Normal", power: 60, accuracy: 95, description: "Slashes target." },
      { name: "Fire Blast", type: "Fire", power: 85, accuracy: 85, description: "Devastating fire blast." }
    ]
  },
  {
    id: 150,
    name: "Mewtwo",
    type: "Psychic",
    maxHp: 200,
    level: 15,
    attack: 110,
    defense: 90,
    speed: 130,
    moves: [
      { name: "Psystrike", type: "Psychic", power: 90, accuracy: 100, description: "Psychic shockwave." },
      { name: "Aura Sphere", type: "Fighting", power: 80, accuracy: 100, description: "Unavoidable aura sphere." },
      { name: "Shadow Ball", type: "Ghost", power: 70, accuracy: 100, description: "Ghost blast." }
    ]
  }
];

// Helper to get front sprite URL
export function getFrontSprite(id: number, name?: string): string {
  // Use PokeAPI animated spr_versions
  if (id === 151) {
    // Mew animated
    return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif";
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
}

// Helper to get back sprite URL
export function getBackSprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${id}.gif`;
}

// Helper to get static sprite in case animated fails
export function getStaticSprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
