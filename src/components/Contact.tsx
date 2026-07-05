import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sound } from "../utils/sound";
import { MessageSquare, Mail, Instagram, Send, X, PhoneCall, Github } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    sound.playLevelUp();
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const toggleWidget = () => {
    sound.playMewCry();
    setWidgetOpen(!widgetOpen);
  };

  return (
    <section 
      id="contact" 
      className="py-16 md:py-24 bg-[#f1f5f9] dark:bg-[#0f172a] border-t-4 border-black dark:border-white px-4 sm:px-6 lg:px-8 font-mono relative select-none transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-black tracking-widest text-[#ef4444] bg-red-50 dark:bg-red-950/40 border-2 border-[#ef4444] px-3 py-1 inline-block uppercase">
            GYM CHALLENGE
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-wider leading-none transition-colors">
            BATTLE <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ef4444] to-red-600 drop-shadow-[0_2.5px_0_rgba(251,191,36,1)]">ME!</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold max-w-md mx-auto">
            Let's discuss your ideas. I'm always open to challenges and new project opportunities!
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Direct Links */}
          <div className="md:col-span-5 space-y-4">
            {/* WhatsApp */}
            <a 
              href="https://wa.me/6281293356536"
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playBeep()}
              className="block p-5 bg-white dark:bg-slate-800 border-4 border-black dark:border-white shadow-[4px_4px_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.15)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all select-none"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-amber-400 border-2 border-black">
                  <PhoneCall className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-300 leading-none mb-1">WHATSAPP</h4>
                  <p className="text-xs font-extrabold text-black dark:text-white leading-none mb-1">+62 812-9335-6536</p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline">CLICK TO CHAT →</span>
                </div>
              </div>
            </a>

            {/* Email */}
            <a 
              href="mailto:israruddin.tech@gmail.com"
              onClick={() => sound.playBeep()}
              className="block p-5 bg-white dark:bg-slate-800 border-4 border-black dark:border-white shadow-[4px_4px_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.15)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all select-none"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-amber-400 border-2 border-black">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-300 leading-none mb-1">EMAIL</h4>
                  <p className="text-xs font-extrabold text-black dark:text-white leading-none mb-1">israruddin.tech@gmail.com</p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline">CLICK TO SEND EMAIL →</span>
                </div>
              </div>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/sra_ajaa"
              target="_blank"
              rel="noreferrer"
              onClick={() => sound.playBeep()}
              className="block p-5 bg-white dark:bg-slate-800 border-4 border-black dark:border-white shadow-[4px_4px_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_rgba(255,255,255,0.15)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all select-none"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-amber-400 border-2 border-black">
                  <Instagram className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-300 leading-none mb-1">INSTAGRAM</h4>
                  <p className="text-xs font-extrabold text-black dark:text-white leading-none mb-1">@sra_ajaa</p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline">CLICK TO FOLLOW →</span>
                </div>
              </div>
            </a>
          </div>

          {/* Right Block: Message Form */}
          <div className="md:col-span-7 bg-white dark:bg-slate-800 border-4 border-black dark:border-white p-6 shadow-[5px_5px_0_rgba(0,0,0,1)] dark:shadow-[5px_5px_0_rgba(255,255,255,0.15)] transition-all">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1 text-left">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase leading-none">NAME</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Trainer Name..."
                    className="w-full px-4 py-3 bg-[#f8fafc] dark:bg-slate-900 border-2 border-black dark:border-slate-600 focus:outline-none focus:bg-white dark:focus:bg-slate-950 text-xs font-mono font-semibold text-black dark:text-white transition-colors"
                  />
                </div>
                {/* Email */}
                <div className="space-y-1 text-left">
                  <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase leading-none">EMAIL</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="trainer@example.com..."
                    className="w-full px-4 py-3 bg-[#f8fafc] dark:bg-slate-900 border-2 border-black dark:border-slate-600 focus:outline-none focus:bg-white dark:focus:bg-slate-950 text-xs font-mono font-semibold text-black dark:text-white transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1 text-left">
                <label className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase leading-none">MESSAGE</label>
                <textarea 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Challenge terms or greetings..."
                  className="w-full px-4 py-3 bg-[#f8fafc] dark:bg-slate-900 border-2 border-black dark:border-slate-600 focus:outline-none focus:bg-white dark:focus:bg-slate-950 text-xs font-mono font-semibold text-black dark:text-white resize-none transition-colors"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full text-center py-3.5 border-4 border-black dark:border-white bg-[#ef4444] text-white font-black text-xs tracking-wider uppercase rounded-none hover:bg-red-600 transition-colors shadow-[3px_3px_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_rgba(255,255,255,0.15)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer select-none"
                >
                  <Send className="w-4 h-4" />
                  CHALLENGE TRAINER
                </button>
              </div>

              {submitted && (
                <p className="text-center text-xs font-black text-[#16a34a] animate-pulse">
                  ✓ GYM CHALLENGE ACCEPTED! ISRARUDDIN WILL REPLY SOON!
                </p>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* FLOATING POKEBALL WIDGET (Bottom Right Corner) */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={toggleWidget}
          whileHover={{ scale: 1.1, rotate: 20 }}
          className="w-16 h-16 bg-[#ef4444] border-4 border-black dark:border-white rounded-full flex items-center justify-center shadow-lg relative cursor-pointer"
          style={{
            background: "linear-gradient(to bottom, #ef4444 48%, #000000 48%, #000000 52%, #ffffff 52%)"
          }}
        >
          {/* Pokéball core button indicator */}
          <div className="w-5 h-5 bg-white border-4 border-black dark:border-white rounded-full flex items-center justify-center relative z-10">
            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
          </div>
          {/* NEW/ALERT sticker */}
          <div className="absolute -top-1 -left-1 bg-amber-400 border-2 border-black text-[7px] font-black tracking-widest px-1 py-0.5 uppercase rotate-[-12deg] shadow-md">
            NEW
          </div>
        </motion.button>
      </div>

      {/* POKEDEX CONTACT WIDGET POPUP DRAWER (Image 6 Replica) */}
      <AnimatePresence>
        {widgetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-[320px] bg-white dark:bg-slate-800 border-4 border-black dark:border-white shadow-[8px_8px_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.15)] overflow-hidden relative font-mono flex flex-col rounded-none"
            >
              {/* Header: Pokédex Red Cover design */}
              <div className="bg-[#ef4444] border-b-4 border-black dark:border-b-slate-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Large blue camera lens */}
                  <div className="w-8 h-8 bg-blue-400 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                    <div className="w-2.5 h-2.5 bg-cyan-100 rounded-full absolute top-1.5 left-1.5" />
                  </div>
                  {/* Yellow, Green, Red lights */}
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-rose-600 border border-black animate-ping" />
                    <div className="w-2 h-2 rounded-full bg-amber-400 border border-black" />
                    <div className="w-2 h-2 rounded-full bg-green-500 border border-black" />
                  </div>
                </div>
                {/* Close Button */}
                <button 
                  onClick={() => { sound.playBeep(); setWidgetOpen(false); }}
                  className="p-1 border-2 border-black bg-white dark:bg-slate-700 text-black dark:text-white cursor-pointer"
                >
                  <X className="w-4 h-4 text-black dark:text-white" />
                </button>
              </div>

              <div className="bg-[#ef4444] text-white px-4 pb-2 text-[10px] font-black tracking-widest leading-none text-left uppercase">
                CONTACT TRAINER
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 bg-slate-50 dark:bg-slate-900 flex-1 flex flex-col items-center transition-colors">
                
                {/* Portrait */}
                <div className="w-24 h-24 rounded-full border-4 border-black dark:border-white overflow-hidden bg-blue-100 dark:bg-slate-800 flex items-center justify-center relative shadow-inner">
                  <img 
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/151.gif" 
                    alt="Israruddin Pixel" 
                    className="w-16 h-16 object-contain image-render-pixelated"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Contact Buttons Stack */}
                <div className="w-full space-y-2.5">
                  <a
                    href="mailto:israruddin.tech@gmail.com"
                    onClick={() => sound.playBeep()}
                    className="w-full py-2.5 bg-red-500 text-white border-2 border-black dark:border-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none uppercase select-none cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    EMAIL
                  </a>
                  <a
                    href="https://github.com/vonnrzky"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sound.playBeep()}
                    className="w-full py-2.5 bg-[#1e293b] text-white border-2 border-black dark:border-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none uppercase select-none cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    GITHUB
                  </a>
                  <a
                    href="https://instagram.com/sra_ajaa"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sound.playBeep()}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-orange-500 text-white border-2 border-black dark:border-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none uppercase select-none cursor-pointer"
                  >
                    <Instagram className="w-4 h-4" />
                    INSTAGRAM
                  </a>
                  <a
                    href="https://wa.me/6281293356536"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => sound.playBeep()}
                    className="w-full py-2.5 bg-[#16a34a] text-white border-2 border-black dark:border-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none uppercase select-none cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    WHATSAPP
                  </a>
                </div>
              </div>

              {/* Bottom design mimicking Pokédex flip hinge */}
              <div className="bg-[#ef4444] h-6 border-t-4 border-black dark:border-t-slate-700 flex items-center justify-center gap-4">
                <div className="w-10 h-1.5 bg-black rounded-full" />
                <div className="w-10 h-1.5 bg-black rounded-full" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
