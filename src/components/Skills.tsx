import { motion } from "motion/react";
import { SKILLS } from "../data";
import { sound } from "../utils/sound";

export default function Skills() {
  const categories = [
    { id: "frontend", title: "FRONTEND BADGES" },
    { id: "backend", title: "BACKEND BADGES" },
    { id: "database", title: "DATABASE & TOOLS" },
    { id: "api", title: "APIS & INTEGRATIONS" }
  ];

  // Helper to determine HP/EXP bar colors based on Level
  const getBarColor = (level: number) => {
    if (level >= 9) return "bg-green-500"; // high mastery
    if (level >= 8) return "bg-amber-500"; // intermediate
    return "bg-rose-500"; // learning / growing
  };

  return (
    <section 
      id="skills" 
      className="py-16 md:py-24 bg-white dark:bg-[#0b0f19] border-t-4 border-black dark:border-white px-4 sm:px-6 lg:px-8 font-mono select-none transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto text-center space-y-12">
        
        {/* Title */}
        <div className="space-y-3">
          <span className="text-xs font-black tracking-widest text-[#ef4444] uppercase bg-red-50 dark:bg-red-950/40 border-2 border-[#ef4444] px-3 py-1 inline-block">
            TRAINER STATUS
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-wider leading-none transition-colors">
            MY <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-600 drop-shadow-[0_2.5px_0_rgba(251,191,36,1)]">BADGES</span>
          </h2>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-left">
          {categories.map((cat) => {
            const items = SKILLS.filter((s) => s.category === cat.id);
            return (
              <div 
                key={cat.id}
                className="border-4 border-black dark:border-white bg-[#f8fafc] dark:bg-slate-800 p-6 shadow-[5px_5px_0_rgba(0,0,0,1)] dark:shadow-[5px_5px_0_rgba(255,255,255,0.15)] flex flex-col justify-between transition-all"
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-6 border-b-4 border-black dark:border-b-white pb-3">
                  <div className="w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-black dark:border-white animate-ping" />
                  <h3 className="text-md font-black text-black dark:text-white tracking-widest uppercase transition-colors">
                    {cat.title}
                  </h3>
                </div>

                {/* EXP bars */}
                <div className="space-y-4">
                  {items.map((skill, index) => (
                    <div 
                      key={index} 
                      className="space-y-1 group"
                      onMouseEnter={() => sound.playBeep()}
                    >
                      {/* Name and Level Label */}
                      <div className="flex justify-between items-end text-xs font-bold font-mono">
                        <span className="text-slate-800 dark:text-slate-200 uppercase group-hover:text-[#ef4444] dark:group-hover:text-red-400 transition-colors">
                          {skill.name}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          Lv.{skill.level}
                        </span>
                      </div>

                      {/* Animated HP/EXP Bar */}
                      <div className="h-4 bg-[#e2e8f0] dark:bg-slate-700 border-2 border-black dark:border-white p-[2px] rounded-none overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level * 10}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                          className={`h-full ${getBarColor(skill.level)}`}
                        >
                          {/* Inner shine segment */}
                          <div className="h-[40%] bg-white opacity-20 w-full" />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
