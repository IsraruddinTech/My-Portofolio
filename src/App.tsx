import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoadingScreen from "./components/LoadingScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import HallOfFame from "./components/HallOfFame";
import Contact from "./components/Contact";
import BattleArena from "./components/BattleArena";
import { sound } from "./utils/sound";
import { TRACKS } from "./utils/tracks";

export default function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("home");
  const [isMuted, setIsMuted] = useState(true); // Default muted to comply with browser autoplay restrictions
  const [isInGame, setIsInGame] = useState(false);
  const [mewAppeared, setMewAppeared] = useState(false);
  const [keystrokes, setKeystrokes] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("trainer-theme");
      return saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  const [currentTrackId, setCurrentTrackId] = useState("gsc-route29");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("trainer-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("trainer-theme", "light");
    }
  }, [isDarkMode]);

  // Synchronous audio player controllers to run inside user clicks using our 8-bit Chiptune Sequencer
  const handleSetIsMuted = (muted: boolean) => {
    setIsMuted(muted);
    sound.setMuteMusic(muted);
  };

  const handleSetCurrentTrackId = (trackId: string) => {
    setCurrentTrackId(trackId);
    sound.setMusicTrack(trackId);
  };

  // Auto-switch track state based on game mode transitions (keep state in sync)
  useEffect(() => {
    if (showLoading) return;

    const nextTrack = isInGame ? "gsc-trainerbattle" : "gsc-route29";
    setCurrentTrackId(nextTrack);
    sound.setMusicTrack(nextTrack);
  }, [isInGame, showLoading]);

  // Global Keyboard listener for Easter Egg "MEW"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Only keep last 10 characters in buffer
      setKeystrokes((prev) => {
        const next = (prev + key).slice(-10);
        if (next.includes("mew")) {
          triggerMewEasterEgg();
          return ""; // clear buffer
        }
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Trigger Mew Easter Egg
  const triggerMewEasterEgg = () => {
    if (mewAppeared) return; // avoid duplicate sweeps
    sound.playMewCry();
    setMewAppeared(true);

    // Float Mew offscreen after 8 seconds
    setTimeout(() => {
      setMewAppeared(false);
    }, 8000);
  };

  // Sync tab navigation on scrolling
  useEffect(() => {
    if (isInGame || showLoading) return;

    const sections = ["home", "skills", "projects", "certificates", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setCurrentTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isInGame, showLoading]);

  const handleStartApp = () => {
    setShowLoading(false);
    setIsMuted(false); // Unmute when user explicitly clicks "Start Game" to comply with browser autoplay policy
    sound.setMuteMusic(false);
    sound.setMusicTrack(currentTrackId);
  };

  const handleToggleGame = () => {
    const nextInGame = !isInGame;
    setIsInGame(nextInGame);
    sound.playLevelUp();

    const nextTrackId = nextInGame ? "gsc-trainerbattle" : "gsc-route29";
    setCurrentTrackId(nextTrackId);
    sound.setMusicTrack(nextTrackId);
  };

  const handleBackToHome = () => {
    setIsInGame(false);
    sound.playBeep();
    setCurrentTrackId("gsc-route29");
    sound.setMusicTrack("gsc-route29");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0f172a] dark:bg-[#0b0f19] dark:text-slate-100 font-mono relative selection:bg-amber-400 selection:text-black transition-colors duration-300">
      
      {/* VINTAGE SCANLINES LAYER OVER FULL PORTFOLIO */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%)] bg-[size:100%_4px] z-50" />

      <AnimatePresence>
        {showLoading ? (
          <LoadingScreen onStart={handleStartApp} />
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Header / Navbar */}
            <Navbar
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              isMuted={isMuted}
              setIsMuted={handleSetIsMuted}
              currentTrackId={currentTrackId}
              setCurrentTrackId={handleSetCurrentTrackId}
              onStartGame={handleToggleGame}
              isInGame={isInGame}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />

            {/* MAIN CONTAINER CONTENT VIEW */}
            <main className="flex-1">
              <AnimatePresence mode="wait">
                {isInGame ? (
                  <motion.div
                    key="battle_game"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <BattleArena onBackToHome={handleBackToHome} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="portfolio_view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Hero onStartGame={handleToggleGame} />
                    <Skills />
                    <Projects />
                    <HallOfFame />
                    <Contact />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* RETRO FOOTER */}
            {!isInGame && (
              <footer className="bg-slate-100 dark:bg-[#0f172a] border-t-4 border-black dark:border-white text-slate-800 dark:text-white py-12 px-4 text-center font-mono select-none transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-6 sm:flex-row text-left">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
                      TRAINER ISRARUDDIN
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                      Evolving beautiful user experiences, capturing robust codebases.
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 text-center sm:text-right">
                    <p>© 2026 ISRARUDDIN. ALL RIGHTS RESERVED.</p>
                    <p className="mt-1 text-[10px] tracking-widest text-[#4f46e5] dark:text-[#a5b4fc]">
                      MADE WITH PASSION · POWERED BY RETRO PIXELS
                    </p>
                  </div>
                </div>
              </footer>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* EASTER EGG: FLOATING MEW SPEEP */}
      <AnimatePresence>
        {mewAppeared && (
          <motion.div
            initial={{ x: "100vw", y: "40vh" }}
            animate={{ x: "-40vw", y: ["40vh", "30vh", "42vh", "35vh"] }}
            exit={{ opacity: 0 }}
            transition={{
              x: { duration: 8, ease: "linear" },
              y: { duration: 8, ease: "easeInOut", repeat: 0 }
            }}
            className="fixed z-50 pointer-events-none flex items-center gap-4 bg-white/95 dark:bg-slate-900/95 border-4 border-pink-400 dark:border-pink-500 p-4 shadow-[6px_6px_0_rgba(244,114,182,1)] dark:shadow-[6px_6px_0_rgba(236,72,153,0.5)] rounded-none transition-colors"
          >
            <img
              src="https://play.pokemonshowdown.com/sprites/ani/mew.gif"
              alt="Mew Floating"
              className="w-24 h-24 object-contain image-render-pixelated animate-bounce"
              referrerPolicy="no-referrer"
            />
            <div className="text-left font-mono">
              <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">
                ★ MEW EASTER EGG ★
              </span>
              <p className="text-xs font-black text-black dark:text-white leading-tight uppercase">
                MEW APPEARED! <br />
                ISRARUDDIN HAS REACHED PERFECTION!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
