import { useState, useRef, MouseEvent } from "react";
import { motion } from "motion/react";
import { Sparkles, Gamepad2, ArrowRight } from "lucide-react";
import { sound } from "../utils/sound";
// @ts-expect-error - static asset import
import israruddinPortrait from "../assets/images/israruddin_original.jpg?url"; 

const imageFallbacks = [
  israruddinPortrait,
  "/src/assets/images/israruddin_original.jpg",
  "/src/assets/images/israruddin_original.jpg",
  "/src/assets/images/israruddin_original.png",
  "/src/assets/images/israruddin_original.jpeg",
  "/src/assets/images/israruddin_original.webp",
];

interface HeroProps {
  onStartGame: () => void;
}

export default function Hero({ onStartGame }: HeroProps) {
  // Image fallback state
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const currentImageSrc = imageFallbacks[fallbackIndex];

  const handleImageError = () => {
    if (fallbackIndex < imageFallbacks.length - 1) {
      setFallbackIndex(prev => prev + 1);
    }
  };

  // 3D Tilt state for Israruddin EX Trading Card
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineStyle, setShineStyle] = useState({ opacity: 0, x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to card center (normalized from -0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Calculate rotations (max 15 degrees)
    setRotateX(-mouseY * 25);
    setRotateY(mouseX * 25);

    // Dynamic shine reflection coordinates
    const shineX = ((e.clientX - rect.left) / width) * 100;
    const shineY = ((e.clientY - rect.top) / height) * 100;
    setShineStyle({
      opacity: 0.5,
      x: shineX,
      y: shineY
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShineStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleButtonClick = (targetId: string) => {
    sound.playBeep();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[calc(100vh-4.5rem)] py-12 md:py-20 flex items-center justify-center bg-[#f1f5f9] dark:bg-[#0f172a] text-black dark:text-white px-4 sm:px-6 lg:px-8 font-mono select-none overflow-hidden transition-colors duration-300"
    >
      {/* Background Grid Pattern (looks like vintage scanlines/retro screen) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Floating Mew Prompt / Warning in Corner */}
      <div className="absolute top-4 left-4 border-4 border-black dark:border-white bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold flex items-center gap-2 shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)] text-black dark:text-white animate-bounce z-10 transition-colors">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
        Type <span className="text-pink-500 font-extrabold font-mono">"MEW"</span> anywhere!
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
        
        {/* Left Side: Speech Bubble, Main Title, Bio and Call to Actions */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* A WILD DEVELOPER APPEARED dialogue block */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 border-4 border-black dark:border-white bg-amber-400 text-black px-4 py-2 font-black text-xs md:text-sm tracking-wider uppercase shadow-[3px_3px_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_rgba(255,255,255,0.15)] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-black animate-spin" />
            A WILD DEVELOPER APPEARED!
          </motion.div>

          {/* Main Name Greeting with retro pixel styling shadow */}
          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white tracking-wider leading-none drop-shadow-[0_4px_0_rgba(148,163,184,0.5)] dark:drop-shadow-[0_4px_0_rgba(255,255,255,0.1)] transition-colors">
              HI, I'M
            </h2>
            <h1 className="text-6xl md:text-8xl font-black tracking-widest text-[#ef4444] leading-none drop-shadow-[0_6px_0_rgba(0,0,0,1)] dark:drop-shadow-[0_6px_0_rgba(255,255,255,0.15)]">
              ISRARUDDIN<span className="text-yellow-400">.</span>
            </h1>
          </div>

          {/* Retro Dialogue box for bio summary */}
          <div className="relative border-4 border-black dark:border-white bg-white dark:bg-slate-800 p-5 md:p-6 shadow-[5px_5px_0_rgba(0,0,0,1)] dark:shadow-[5px_5px_0_rgba(255,255,255,0.15)] rounded-none transition-colors">
            {/* Small corner detail mimicking dialogue cursor */}
            <div className="absolute -bottom-4 left-6 w-0 h-0 border-x-8 border-x-transparent border-t-12 border-t-black dark:border-t-white" />
            <div className="absolute -bottom-3 left-6 w-0 h-0 border-x-6 border-x-transparent border-t-10 border-t-white dark:border-t-slate-800" />

            <p className="text-sm md:text-base leading-relaxed text-slate-800 dark:text-slate-200 font-semibold font-sans">
              I am a <span className="text-[#3b82f6] dark:text-[#60a5fa] font-bold">Lv. 99 Fullstack Developer</span> dedicated to battling complex bugs, evolving high-performance web applications, and capturing robust backend architectures!
            </p>
          </div>

          {/* Quick Action buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => handleButtonClick("projects")}
              className="px-6 py-3.5 border-4 border-black dark:border-white bg-red-500 text-white font-black text-xs tracking-wider uppercase rounded-none hover:bg-red-600 transition-colors cursor-pointer flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.15)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 select-none"
            >
              <img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
                alt="Pokeball" 
                className="w-5 h-5 image-render-pixelated animate-bounce"
                referrerPolicy="no-referrer"
              />
              VIEW POKÉDEX
            </button>
            <button
              onClick={onStartGame}
              className="px-6 py-3.5 border-4 border-black dark:border-white bg-amber-400 text-black font-black text-xs tracking-wider uppercase rounded-none hover:bg-amber-300 transition-colors cursor-pointer flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.15)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 select-none"
            >
              <Gamepad2 className="w-5 h-5 animate-pulse" />
              BATTLE ME!
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Holographic Israruddin EX Card & Floating Charizard Sprite */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative mt-8 lg:mt-0">
          
          {/* Floating animated Charizard next to the card - Flying Dragon Mode */}
          <motion.div
            animate={{
              y: [0, -25, 10, -15, 0],
              x: [0, 15, -10, 20, 0],
              rotate: [0, 6, -4, 4, 0],
              scale: [1, 1.05, 0.98, 1.02, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-24 -left-16 hidden sm:block pointer-events-none z-20"
          >
            <div className="relative">
              {/* Optional glowing fire aura */}
              <div className="absolute inset-0 bg-amber-500 rounded-full filter blur-xl opacity-20 animate-pulse scale-125" />
              <img
                src="https://play.pokemonshowdown.com/sprites/ani/charizard.gif"
                alt="Charizard Flying Dragon Mode"
                className="w-36 h-36 object-contain image-render-pixelated drop-shadow-[0_12px_20px_rgba(239,68,68,0.4)] relative z-10"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Card Frame containing holographic 3D tilt block */}
          <div className="perspective-[1000px] w-full max-w-[340px]">
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{
                rotateX: rotateX,
                rotateY: rotateY,
              }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
              style={{ transformStyle: "preserve-3d" }}
              className="w-full h-[480px] bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 border-[10px] border-[#fbbf24] rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col p-4 select-none cursor-pointer"
            >
              {/* Holographic reflection shine overlay */}
              <div 
                className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-200"
                style={{
                  opacity: shineStyle.opacity,
                  background: `radial-gradient(circle at ${shineStyle.x}% ${shineStyle.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`,
                  mixBlendMode: "color-dodge"
                }}
              />

              {/* CARD TOP BAR (Name & HP) */}
              <div className="flex items-center justify-between z-10">
                <div>
                  <h3 className="text-lg font-black text-white leading-none font-sans uppercase">
                    ISRARUDDIN EX
                  </h3>
                  <p className="text-[9px] text-[#fed7aa] font-medium leading-none mt-0.5">
                    Full Stack Developer
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-red-600 border-2 border-black px-2 py-0.5 shadow-[1px_1px_0_rgba(0,0,0,1)]">
                  <span className="text-[9px] font-extrabold text-white">HP</span>
                  <span className="text-xs font-black text-white">99</span>
                </div>
              </div>

              {/* PORTRAIT IMAGE FRAME */}
              <div className="h-44 border-4 border-[#cbd5e1] bg-gradient-to-tr from-[#1e293b] to-[#475569] my-2.5 relative overflow-hidden shadow-inner flex items-center justify-center">
                {/* Holographic background noise/circles */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] animate-[pulse_3s_infinite]" />
                
                {/* Portrait of Israruddin */}
                <img
                  src={currentImageSrc}
                  alt="Israruddin Portrait"
                  className="w-full h-full object-cover absolute z-10"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                />

                {/* Subtext info on portrait frame */}
                <div className="absolute bottom-1 right-2 z-20 bg-black/50 px-1.5 py-0.5">
                  <span className="text-[7px] text-[#f8fafc] tracking-widest font-mono">
                    NO. 099 DEVELOPER TYPE
                  </span>
                </div>
              </div>

              {/* CAPABILITY / ATTACK BLOCK */}
              <div className="flex-1 bg-[#fffbeb] border-4 border-[#b45309] p-2.5 text-black flex flex-col justify-between font-mono">
                
                {/* Skill 1: Full Stack Mastery */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black tracking-wide text-red-600">
                      ⚡ Full Stack Mastery
                    </span>
                    <span className="text-xs font-black">∞</span>
                  </div>
                  <p className="text-[8.5px] text-slate-700 leading-tight font-sans">
                    Builds and deploys robust scalable web apps from frontend to backend. Master of React, Node, Laravel, and cloud engines.
                  </p>
                </div>

                {/* Divider */}
                <hr className="border-t-2 border-dashed border-[#b45309] my-1" />

                {/* Card Strengths / Stats */}
                <div className="grid grid-cols-3 gap-1.5 text-center pt-0.5">
                  <div className="bg-[#fef3c7] border border-[#d97706] p-1">
                    <p className="text-[7.5px] text-amber-800 uppercase font-black">Weakness</p>
                    <p className="text-[9px] font-extrabold text-red-600 uppercase">BUGS</p>
                  </div>
                  <div className="bg-[#fef3c7] border border-[#d97706] p-1">
                    <p className="text-[7.5px] text-amber-800 uppercase font-black">Resistance</p>
                    <p className="text-[9px] font-extrabold text-[#16a34a] uppercase">ERRORS</p>
                  </div>
                  <div className="bg-[#fef3c7] border border-[#d97706] p-1">
                    <p className="text-[7.5px] text-amber-800 uppercase font-black">EVAL</p>
                    <p className="text-[9px] font-extrabold text-blue-600 uppercase">LV. 99</p>
                  </div>
                </div>
              </div>

              {/* CARD BOTTOM DETAILS */}
              <div className="mt-2 flex items-center justify-between text-[7px] text-white">
                <span>Illus. AI Studio Builder</span>
                <span>© 2026 Pokémon TCG</span>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
