import { motion } from "motion/react";
import { PROJECTS } from "../data";
import { sound } from "../utils/sound";
import { ExternalLink, Github } from "lucide-react";

export default function Projects() {
  return (
    <section 
      id="projects" 
      className="py-16 md:py-24 bg-[#f1f5f9] dark:bg-[#0f172a] border-t-4 border-black dark:border-white px-4 sm:px-6 lg:px-8 font-mono select-none transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-black tracking-widest text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-600 dark:border-blue-400 px-3 py-1 inline-block">
            CAPTURED REPOS
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-wider leading-none transition-colors">
            MY <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ef4444] to-red-600 drop-shadow-[0_2.5px_0_rgba(251,191,36,1)]">POKÉDEX</span>
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-4 border-black dark:border-white bg-white dark:bg-slate-800 shadow-[5px_5px_0_rgba(0,0,0,1)] dark:shadow-[5px_5px_0_rgba(255,255,255,0.15)] flex flex-col justify-between overflow-hidden relative group hover:-translate-y-1 transition-all"
              onMouseEnter={() => sound.playBeep()}
            >
              {/* Image Frame */}
              <div className="h-48 border-b-4 border-black dark:border-b-white overflow-hidden relative">
                {/* Red/White horizontal split bar on hover */}
                <div className="absolute top-2 left-2 bg-black dark:bg-slate-900 text-white text-[9px] font-black tracking-widest px-2 py-0.5 z-10 border-2 border-black dark:border-white">
                  ENTRY #{index + 1}
                </div>
                
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Vintage overlay */}
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
              </div>

              {/* Pokédex Data Fields */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Title and Element types/tags */}
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-black dark:text-white tracking-wide uppercase transition-colors">
                    {project.title}
                  </h3>

                  {/* Element tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, tIdx) => {
                      // Color coding like Pokemon types
                      let color = "bg-slate-100 border-slate-400 text-slate-800 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-200";
                      if (["react", "vite", "typescript"].includes(tag.toLowerCase())) {
                        color = "bg-blue-100 border-blue-400 text-blue-700 dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-300";
                      } else if (["laravel", "php"].includes(tag.toLowerCase())) {
                        color = "bg-red-100 border-red-400 text-red-700 dark:bg-red-950/40 dark:border-red-700 dark:text-red-300";
                      } else if (["mongodb", "postgresql", "firebase"].includes(tag.toLowerCase())) {
                        color = "bg-emerald-100 border-emerald-400 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-300";
                      }
                      
                      return (
                        <span 
                          key={tIdx} 
                          className={`text-[9px] font-extrabold tracking-widest uppercase px-2 py-0.5 border border-black dark:border-slate-500 ${color}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Entry Description in retro box */}
                <div className="border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 min-h-[90px] text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-sans font-medium transition-colors">
                  {project.description}
                </div>

                {/* Bottom Action buttons */}
                <div className="flex gap-2.5 pt-2">
                  <a 
                    href={project.demoUrl}
                    onClick={() => sound.playLevelUp()}
                    className="flex-1 text-center py-2 border-4 border-black dark:border-white bg-blue-500 text-white font-black text-[11px] tracking-wider uppercase rounded-none shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center gap-1.5 transition-all select-none"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    DEMO / PLAY
                  </a>
                  <a 
                    href={project.codeUrl}
                    onClick={() => sound.playBeep()}
                    className="px-3 py-2 border-4 border-black dark:border-white bg-white dark:bg-slate-800 text-black dark:text-white font-black text-[11px] hover:bg-slate-100 dark:hover:bg-slate-700 shadow-[2px_2px_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_rgba(255,255,255,0.15)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center transition-all select-none"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
