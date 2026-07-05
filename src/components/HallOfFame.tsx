import { motion } from "motion/react";
import { CERTIFICATES } from "../data";
import { sound } from "../utils/sound";
import { Award, Calendar, CheckSquare } from "lucide-react";

export default function HallOfFame() {
  return (
    <section 
      id="certificates" 
      className="py-16 md:py-24 bg-white dark:bg-[#0b0f19] border-t-4 border-black dark:border-white px-4 sm:px-6 lg:px-8 font-mono select-none transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs font-black tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-600 dark:border-amber-400 px-3 py-1 inline-block uppercase">
            TRAINER BADGES
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-wider leading-none uppercase transition-colors">
            HALL OF <span className="text-transparent bg-clip-text bg-gradient-to-b from-amber-400 to-amber-600 drop-shadow-[0_2.5px_0_rgba(0,0,0,1)] dark:drop-shadow-[0_2.5px_0_rgba(255,255,255,0.15)]">FAME</span>
          </h2>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CERTIFICATES.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-4 border-black dark:border-white bg-[#fafaf9] dark:bg-slate-800 p-5 shadow-[5px_5px_0_rgba(0,0,0,1)] dark:shadow-[5px_5px_0_rgba(255,255,255,0.15)] flex flex-col sm:flex-row gap-5 items-center relative overflow-hidden group hover:bg-stone-50 dark:hover:bg-slate-700 transition-all"
              onMouseEnter={() => sound.playBeep()}
            >
              {/* Golden corner emblem mimicking medal slots */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-amber-400 border-b-4 border-l-4 border-black dark:border-black dark:border-l-white dark:border-b-white rotate-45 translate-x-6 -translate-y-6 flex items-end justify-center pb-1 pointer-events-none">
                <Award className="w-3.5 h-3.5 text-black -rotate-45" />
              </div>

              {/* Certificate Image Frame */}
              <div className="w-32 h-32 flex-shrink-0 border-4 border-black dark:border-white overflow-hidden bg-stone-200 dark:bg-slate-950 shadow-inner">
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Certificate Metadata fields */}
              <div className="flex-1 space-y-3 text-left w-full">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 dark:border-amber-500 px-2 py-0.5 uppercase tracking-wider inline-block">
                    {cert.category}
                  </span>
                  <h3 className="text-sm md:text-md font-black text-black dark:text-white uppercase leading-tight font-mono transition-colors">
                    {cert.title}
                  </h3>
                </div>

                <div className="space-y-1 text-slate-600 dark:text-slate-300 text-xs font-mono font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
                    <span>Issued: <strong className="text-slate-800 dark:text-slate-100">{cert.issuer}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
                    <span>Date: <strong className="text-slate-800 dark:text-slate-100">{cert.date}</strong></span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
