import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Volume2, Play } from "lucide-react";
import { sound } from "../utils/sound";

interface LoadingScreenProps {
  onStart: () => void;
}

const PixelCloud = () => (
  <svg className="w-12 h-8 fill-current" viewBox="0 0 16 10">
    <path d="M5 2h6v1h2v1h1v3h-1v1h-1v1H3V8H2V7H1V4h1V3h3V2z" />
  </svg>
);

export default function LoadingScreen({ onStart }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [stars, setStars] = useState<{ id: number; top: number; left: number; size: number; delay: number }[]>([]);
  
  // State for stage 2 (the screenshot asset loader)
  const [pokedexLoading, setPokedexLoading] = useState(false);
  const [pokedexProgress, setPokedexProgress] = useState(0);
  const [pokedexStatus, setPokedexStatus] = useState("LOADING ASSETS");

  // Drifting retro clouds config
  const [clouds] = useState([
    { id: 1, top: "25%", delay: 0, duration: 22 },
    { id: 2, top: "35%", delay: 6, duration: 28 },
    { id: 3, top: "28%", delay: 12, duration: 25 }
  ]);

  // Generate random stars for retro space atmosphere (Stage 1)
  useEffect(() => {
    const generatedStars = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3
    }));
    setStars(generatedStars);
  }, []);

  // Loading bar progress animation for Stage 1
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoaded(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Assets loading animation for Stage 2 (the requested screen)
  useEffect(() => {
    if (!pokedexLoading) return;

    const statuses = [
      "LOADING ASSETS",
      "INITIALIZING POKÉDEX...",
      "LOADING POKÉMON DATA...",
      "BOOTING CORE SYSTEM...",
      "SYNCHRONIZING PORTFOLIO...",
      "TRAINER DETAILS ACQUIRED!",
      "COMPLETE!"
    ];

    let currentVal = 0;
    const interval = setInterval(() => {
      // Step-wise progress increment
      const increment = Math.floor(Math.random() * 8) + 4;
      currentVal = Math.min(currentVal + increment, 100);
      setPokedexProgress(currentVal);

      // Update description label dynamically
      if (currentVal < 20) {
        setPokedexStatus(statuses[0]);
      } else if (currentVal < 40) {
        setPokedexStatus(statuses[1]);
      } else if (currentVal < 60) {
        setPokedexStatus(statuses[2]);
      } else if (currentVal < 75) {
        setPokedexStatus(statuses[3]);
      } else if (currentVal < 90) {
        setPokedexStatus(statuses[4]);
      } else if (currentVal < 100) {
        setPokedexStatus(statuses[5]);
      } else {
        setPokedexStatus(statuses[6]);
        clearInterval(interval);
        
        // Transition to app when reaching 100%
        setTimeout(() => {
          onStart();
        }, 900);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [pokedexLoading, onStart]);

  const handleStartApp = () => {
    sound.playLevelUp();
    
    // Play music immediately so user gets beautiful background music during the load screen
    sound.setMuteMusic(false);
    sound.setMusicTrack("gsc-route29");
    
    // Start the awesome screenshot loader
    setPokedexLoading(true);
  };

  // Listen to keyboard press to trigger start
  useEffect(() => {
    if (!loaded || pokedexLoading) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        handleStartApp();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loaded, pokedexLoading]);

  // Stage 2: The Pokedex initial loading menu (as requested!)
  if (pokedexLoading) {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d1527] text-white select-none overflow-hidden"
        id="pokedex-loading-screen"
        style={{
          backgroundImage: `
            linear-gradient(rgba(38, 55, 87, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(38, 55, 87, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      >
        {/* scanlines overlay for vintage monitor look */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px]" />

        {/* Decorative Circle Outlines - Top Right */}
        <div className="border border-slate-700/20 rounded-full absolute -top-24 -right-24 w-96 h-96 pointer-events-none" />
        <div className="border border-slate-700/10 rounded-full absolute -top-12 -right-12 w-64 h-64 pointer-events-none" />

        {/* Decorative Circle Outlines - Bottom Left */}
        <div className="border-2 border-red-500/10 rounded-full absolute -bottom-32 -left-32 w-80 h-80 pointer-events-none" />

        {/* Drifting Retro Clouds */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {clouds.map((cloud) => (
            <motion.div
              key={cloud.id}
              className="absolute text-slate-700/20"
              style={{ top: cloud.top, left: "-100px" }}
              animate={{ x: ["0vw", "120vw"] }}
              transition={{
                duration: cloud.duration,
                delay: cloud.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <PixelCloud />
            </motion.div>
          ))}
        </div>

        {/* Content Wrapper */}
        <div className="w-full max-w-2xl px-8 flex flex-col justify-center relative">
          
          {/* Logo / Header Area */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center flex-wrap">
              <span className="text-[#f43f5e] font-press-start font-extrabold text-2xl md:text-3xl tracking-wide">
                Student
              </span>
              <span className="text-white font-press-start font-extrabold text-2xl md:text-3xl tracking-wide ml-3">
                TRAINER
              </span>
            </div>
            <div className="mt-2 md:mt-3">
              <span className="text-white font-press-start font-extrabold text-4xl md:text-5xl tracking-widest leading-none block uppercase">
                ISRARUDDIN<span className="text-[#fbbf24] font-bold">.</span>
              </span>
            </div>
            <p className="mt-4 text-[#475a7c] font-mono text-xs md:text-sm font-bold tracking-widest uppercase animate-pulse">
              INITIALIZING POKÉDEX...
            </p>
          </div>

          {/* Charizard Area */}
          <div className="flex justify-end pr-4 -mb-3 relative z-10">
            <motion.div
              animate={{
                y: [0, -10, 0, -6, 0],
                rotate: [0, 2, -2, 1, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/40 blur-md rounded-full scale-90" />
              <img
                src="https://play.pokemonshowdown.com/sprites/ani/charizard.gif"
                alt="Charizard Flying Dragon"
                className="w-28 h-28 md:w-32 md:h-32 object-contain image-render-pixelated"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          {/* Progress Loading Bar Container */}
          <div className="w-full">
            {/* Outline box */}
            <div className="border-[3px] border-[#e2e8f0] bg-black/40 h-8 p-[3px] rounded-none overflow-hidden flex">
              <div 
                className="h-full bg-[#f43f5e] transition-all duration-75 ease-out flex justify-end"
                style={{ width: `${pokedexProgress}%` }}
              >
                {pokedexProgress > 0 && (
                  <div className="w-3 h-full bg-[#fbbf24] shrink-0 animate-pulse" />
                )}
              </div>
            </div>

            {/* Label and Percentage Row */}
            <div className="flex justify-between items-start mt-3">
              <span className="text-[#64748b] font-mono text-xs font-bold tracking-widest uppercase mt-1">
                {pokedexStatus}
              </span>
              <span className="text-white font-press-start text-xl md:text-2xl font-extrabold drop-shadow-[2px_2px_0_rgba(244,63,94,1)]">
                {pokedexProgress}%
              </span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Stage 1: Introductory Screen
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#0b0c16] text-[#e0e2ed] font-mono select-none overflow-hidden"
      id="retro-loading-screen"
    >
      {/* Retro Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              opacity: 0.8
            }}
          />
        ))}
      </div>

      {/* scanlines overlay for vintage monitor look */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]" />

      {/* Top Copyright Block */}
      <div className="mt-12 text-center z-10">
        <span className="text-[#a5b4fc] text-xs tracking-widest font-mono font-medium">
          © 2026 Information Systems Student at Syarif Hidayatullah State Islamic University Jakarta. 
        </span>
      </div>

      {/* Center Display Logo & Sprite */}
      <div className="flex flex-col items-center justify-center flex-1 z-10 max-w-md px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center"
        >
          {/* Retro Israruddin Logo */}
          <h1 className="text-7xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-600 drop-shadow-[0_4px_0_rgba(251,191,36,1)] select-none">
            ISRARUDDIN
          </h1>
          <p className="mt-3 text-sm font-semibold tracking-[0.2em] text-[#cbd5e1] uppercase">
            Website Developer & IT Support | Portfolio 2026
          </p>
        </motion.div>

        {/* Floating Charizard Sprite - Flying Dragon Mode */}
        <motion.div
          animate={{
            y: [0, -18, 5, -12, 0],
            rotate: [0, 4, -4, 2, 0],
            scale: [1, 1.04, 0.98, 1.02, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="my-10 relative"
        >
          {/* Red aura behind Charizard */}
          <div className="absolute inset-0 bg-orange-600 rounded-full filter blur-xl opacity-30 animate-pulse scale-110" />
          <img
            src="https://play.pokemonshowdown.com/sprites/ani/charizard.gif"
            alt="Charizard Flying Dragon"
            className="w-44 h-44 relative z-10 object-contain image-render-pixelated"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Loading Progress Bar or Start Button */}
        <div className="w-64 min-h-[4rem] flex flex-col items-center justify-center">
          {!loaded ? (
            <div className="w-full">
              <div className="h-4 bg-[#1e293b] border-2 border-[#475569] p-[2px] rounded-none overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-100 ease-out flex"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-full h-[50%] bg-amber-300 opacity-60" />
                </div>
              </div>
              <p className="text-center text-xs mt-2 text-amber-400 tracking-widest animate-pulse font-mono">
                LOADING SYSTEM... {progress}%
              </p>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartApp}
              className="px-6 py-3 bg-amber-400 text-black font-extrabold text-sm border-4 border-black hover:bg-amber-300 transition-colors shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center gap-3 cursor-pointer select-none rounded-none font-mono"
              id="start-button"
            >
              <Play className="w-4 h-4 fill-black" />
              PRESS START GAME
            </motion.button>
          )}
        </div>
      </div>

      {/* Bottom Controls Indicator */}
      <div className="mb-12 text-center z-10 px-6">
        {loaded ? (
          <p className="text-xs text-[#94a3b8] tracking-widest animate-bounce">
            CLICK ANYWHERE · PRESS ENTER OR SPACE
          </p>
        ) : (
          <p className="text-xs text-[#475569] tracking-widest font-mono">
            PSST... TRY TYPING "MEW" ONCE IN THE PORTFOLIO!
          </p>
        )}
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#64748b]">
          <Volume2 className="w-3.5 h-3.5" />
          <span>PORTFOLIO BACKSOUND MUSIC WILL ACTIVATE</span>
        </div>
      </div>
    </div>
  );
}

