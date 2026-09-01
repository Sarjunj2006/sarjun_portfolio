import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchContent } from '../lib/api';

gsap.registerPlugin(ScrollTrigger);

// Fallback content shown if the CMS backend isn't running
const DEFAULT_ABOUT = {
  bio_intro: "I am Sarjun J, a B.Sc. Computer Science graduate with a specialization in Data Analytics.",
  bio_body: "I'm a passionate developer focused on building intelligent, scalable applications using Python, AI/ML, RAG, LLMs, FastAPI, LangChain, and LangGraph. I enjoy turning complex problems into practical solutions while continuously exploring modern AI technologies, backend systems, and databases.",
  tags: "AI & ML, RAG & LLMs, Data Analytics",
  tech_stack: "Python, FastAPI, LangChain, Git, AI/ML, RAG",
};

const About = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const [about, setAbout] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    fetchContent('/about', DEFAULT_ABOUT).then(setAbout);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // --- Cinematic Stagger Entrance on Scroll ---
    gsap.fromTo(
      cardRefs.current,
      { y: 80, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // --- Interactive Magnetic Mouse Spotlight per Bento Card ---
    const cards = cardRefs.current;
    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    cards.forEach((card) => {
      if (!card) return;
      const listener = (e) => handleMouseMove(e, card);
      card.addEventListener('mousemove', listener);
      return () => card.removeEventListener('mousemove', listener);
    });

  }, []);

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#0a0e1a] text-white py-32 px-6 md:px-12 flex flex-col justify-center select-none overflow-hidden"
    >
      {/* Background Cinematic Red Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-[#0a0e1a]/80 backdrop-blur-2xl border border-blue-600/40 text-xs font-mono uppercase tracking-widest text-white shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            <span className="text-blue-500 font-bold">PROFILE</span>
            <span className="text-white/40">|</span>
            <span>ABOUT THE ENGINEER</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
            ABOUT ME <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-500 to-blue-700 drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              ORIGIN & VISION.
            </span>
          </h2>
        </div>

        {/* Bento Grid Layout with Interactive Mouse Light Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Bio & Academic Core (Full Width) */}
          <div
            ref={addToRefs}
            className="md:col-span-12 p-8 md:p-12 bg-[#131c31]/90 backdrop-blur-2xl border border-white/15 rounded-[2.5rem] shadow-2xl flex flex-col justify-between relative group hover:border-blue-600/60 transition-all duration-500 overflow-hidden"
          >
            {/* Real-time mouse hover spotlight highlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(37,99,235,0.15), transparent 70%)'
              }}
            ></div>

            <div className="absolute top-0 right-0 p-8 text-white/5 font-mono text-7xl font-black pointer-events-none">
              01
            </div>
            
            <div className="space-y-5 relative z-10">
              <h3 className="text-xs font-mono uppercase tracking-widest text-blue-500 font-bold">Cast & Background</h3>
              <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed">
                {about.bio_intro}
              </p>
              <p className="text-sm md:text-base text-white/60 font-light leading-relaxed">
                {about.bio_body}
              </p>
            </div>
            
            <div className="pt-8 flex flex-wrap gap-2 relative z-10">
              {about.tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag, idx) => (
                <span key={idx} className="px-3.5 py-1.5 rounded bg-white/10 border border-white/15 text-xs font-mono text-white/80">{tag}</span>
              ))}
            </div>
          </div>

          {/* Card 3: Technical Ecosystem (Span 12) */}
          <div
            ref={addToRefs}
            className="md:col-span-12 p-8 md:p-12 bg-[#131c31]/90 backdrop-blur-2xl border border-white/15 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-600/60 transition-all duration-500 overflow-hidden relative group"
          >
            {/* Real-time mouse hover spotlight highlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(37,99,235,0.15), transparent 70%)'
              }}
            ></div>

            <div className="space-y-2 text-left relative z-10">
              <h3 className="text-xs font-mono uppercase tracking-widest text-blue-500 font-bold">Production Tech Stack</h3>
              <p className="text-base md:text-lg font-semibold text-white">Equipped with industry-grade instruments for robust scaling.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 relative z-10">
              {about.tech_stack.split(',').map((t) => t.trim()).filter(Boolean).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded bg-white/[0.04] border border-white/15 text-xs font-mono uppercase tracking-wider text-white shadow-inner hover:bg-blue-600/20 hover:border-blue-600/40 hover:scale-105 transition-all"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;