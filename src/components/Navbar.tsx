import { useState } from "react";
import { Volume2, VolumeX, Menu, X, Gamepad2, Sparkles, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { sound } from "../utils/sound";
import { TRACKS } from "../utils/tracks";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  currentTrackId: string;
  setCurrentTrackId: (id: string) => void;
  onStartGame: () => void;
  isInGame: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  isMuted,
  setIsMuted,
  currentTrackId,
  setCurrentTrackId,
  onStartGame,
  isInGame,
  isDarkMode,
  setIsDarkMode
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handlePrevTrack = () => {
    sound.playBeep();
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrackId);
    const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackId(TRACKS[prevIndex].id);
  };

  const handleNextTrack = () => {
    sound.playBeep();
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % TRACKS.length;
    setCurrentTrackId(TRACKS[nextIndex].id);
  };

  const navItems = [
    { id: "home", label: "HOME" },
    { id: "skills", label: "SKILLS" },
    { id: "projects", label: "PROJECTS" },
    { id: "certificates", label: "HALL OF FAME" },
    { id: "contact", label: "CONTACT" }
  ];

  const handleNavClick = (id: string) => {
    sound.playBeep();
    setCurrentTab(id);
    setMobileOpen(false);

    // Smooth scroll
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMuteToggle = () => {
    sound.playBeep();
    setIsMuted(!isMuted);
  };

  const handleStartGameClick = () => {
    sound.playLevelUp();
    onStartGame();
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#f8fafc] dark:bg-[#0f172a] border-b-4 border-black font-mono transition-colors duration-300">
      {/* Top Retro Red Status Stripe */}
      <div className="h-2.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand/Logo */}
          <div 
            onClick={() => handleNavClick("home")}
            className="flex flex-col cursor-pointer select-none group"
          >
            <span className="text-[10px] font-extrabold text-[#ef4444] dark:text-[#f87171] leading-none tracking-widest flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 animate-spin text-amber-500" />
              ? OPEN TO WORK ?
            </span>
            <span className="text-2xl font-black text-black dark:text-white leading-none tracking-wider group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
              ISRARUDDIN<span className="text-red-500">.</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2 border-4 border-black bg-white dark:bg-slate-800 p-1 rounded-none shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)] transition-colors">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 text-xs font-black tracking-wider transition-all select-none rounded-none cursor-pointer ${
                  currentTab === item.id && !isInGame
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700 text-black dark:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark Mode Toggle button */}
            <button
              onClick={() => {
                sound.playBeep();
                setIsDarkMode(!isDarkMode);
              }}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 border-4 border-black bg-white dark:bg-slate-800 text-black dark:text-white transition-all select-none shadow-[3px_3px_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_rgba(255,255,255,0.15)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400 fill-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {/* Retro Audio Player Console */}
            <div className="flex items-center gap-1.5 border-4 border-black bg-white dark:bg-slate-800 p-1 shadow-[3px_3px_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_rgba(255,255,255,0.15)] select-none">
              {/* Mute/Unmute Toggle */}
              <button
                onClick={handleMuteToggle}
                title={isMuted ? "Unmute Pokémon Music" : "Mute Pokémon Music"}
                className={`p-1.5 border-2 border-black dark:border-slate-600 transition-all select-none cursor-pointer ${
                  isMuted 
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-black dark:hover:text-white" 
                    : "bg-red-500 text-white"
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* LCD Track Screen & Cycle Controls */}
              {!isMuted && (
                <div className="flex items-center gap-1">
                  {/* Prev Button */}
                  <button
                    onClick={handlePrevTrack}
                    title="Previous Track"
                    className="p-0.5 border-2 border-black dark:border-slate-600 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 text-black dark:text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Tiny retro LCD Screen showing track info */}
                  <div className="bg-[#0f172a] border-2 border-black dark:border-slate-900 px-2 py-0.5 font-mono text-[9px] text-[#10b981] flex items-center gap-2 w-32 justify-between">
                    {/* Animated visualizer soundwave */}
                    <div className="flex items-end gap-0.5 h-3 flex-shrink-0">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ["2px", "10px", "2px"] }}
                          transition={{
                            duration: 0.4 + i * 0.12,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-0.5 bg-[#10b981] rounded-t-sm"
                        />
                      ))}
                    </div>

                    {/* Track Name */}
                    <span className="font-extrabold uppercase tracking-wider truncate text-right flex-1 select-none">
                      {TRACKS.find(t => t.id === currentTrackId)?.name.replace(" (GSC)", "").replace(" (RBY)", "")}
                    </span>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextTrack}
                    title="Next Track"
                    className="p-0.5 border-2 border-black dark:border-slate-600 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 text-black dark:text-white cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Muted indicator */}
              {isMuted && (
                <div className="bg-slate-100 dark:bg-slate-900 px-2 py-0.5 font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest border-2 border-slate-200 dark:border-slate-700 select-none">
                  MUTED
                </div>
              )}
            </div>

            {/* Start Game Button */}
            <button
              onClick={handleStartGameClick}
              className={`px-5 py-2 border-4 border-black text-xs font-extrabold tracking-wider select-none transition-all cursor-pointer rounded-none flex items-center gap-2 shadow-[3px_3px_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_rgba(255,255,255,0.15)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 ${
                isInGame 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "bg-amber-400 text-black hover:bg-amber-300"
              }`}
            >
              <Gamepad2 className={`w-4 h-4 ${isInGame ? "animate-pulse" : "animate-bounce"}`} />
              {isInGame ? "EXIT GAME" : "START GAME"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => {
                sound.playBeep();
                setIsDarkMode(!isDarkMode);
              }}
              className="p-2 border-4 border-black bg-white dark:bg-slate-800 text-black dark:text-white select-none shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)]"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400 fill-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            <button
              onClick={handleMuteToggle}
              className={`p-2 border-4 border-black bg-white dark:bg-slate-800 select-none shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)] ${
                isMuted ? "text-gray-400 dark:text-slate-500" : "text-red-500"
              }`}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => { sound.playBeep(); setMobileOpen(!mobileOpen); }}
              className="p-2 border-4 border-black bg-white dark:bg-slate-800 text-black dark:text-white active:bg-slate-100 dark:active:bg-slate-700 cursor-pointer shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Pokédex style popdown) */}
      {mobileOpen && (
        <div className="md:hidden border-t-4 border-black bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2 font-mono transition-colors duration-300">
          {/* Mobile Retro Music Player */}
          <div className="border-4 border-black bg-slate-50 dark:bg-slate-800 p-3 flex flex-col gap-2 shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.1)]">
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase leading-none block">
              ● POKÉMON RETRO PLAYER
            </span>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleMuteToggle}
                className={`px-3 py-2 border-2 border-black font-extrabold text-xs tracking-wider flex items-center gap-1.5 cursor-pointer ${
                  isMuted 
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-500" 
                    : "bg-red-500 text-white"
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-bounce" />}
                {isMuted ? "MUTED" : "PLAYING"}
              </button>

              {!isMuted && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevTrack}
                    className="p-1 border-2 border-black bg-white dark:bg-slate-900 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-black dark:text-white" />
                  </button>
                  <div className="bg-[#0f172a] border-2 border-black dark:border-slate-700 px-2 py-1 font-mono text-[9px] text-[#10b981] flex items-center gap-2 w-28 overflow-hidden justify-between">
                    <span className="font-extrabold uppercase truncate">
                      {TRACKS.find(t => t.id === currentTrackId)?.name.replace(" (GSC)", "").replace(" (RBY)", "")}
                    </span>
                  </div>
                  <button
                    onClick={handleNextTrack}
                    className="p-1 border-2 border-black bg-white dark:bg-slate-900 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-black dark:text-white" />
                  </button>
                </div>
              )}

              {isMuted && (
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                  TAP UNMUTE TO HEAR
                </span>
              )}
            </div>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 text-xs font-bold border-4 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.1) ] cursor-pointer ${
                currentTab === item.id && !isInGame
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-black dark:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleStartGameClick}
            className={`w-full text-center py-3 border-4 border-black font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.1)] ${
              isInGame 
                ? "bg-red-500 text-white" 
                : "bg-amber-400 text-black"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            {isInGame ? "EXIT GAME" : "START POKEMON BATTLE"}
          </button>
        </div>
      )}
    </nav>
  );
}
