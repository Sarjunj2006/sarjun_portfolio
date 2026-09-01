import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchContent } from '../lib/api';

gsap.registerPlugin(ScrollTrigger);

// Fallback content shown if the CMS backend isn't running or has no data yet
const DEFAULT_SKILLS = [
  { 
    title: 'AI & Machine Learning', 
    desc: 'Building intelligent applications powered by large language models, retrieval-augmented generation, and NLP.', 
    tag: 'INTELLIGENCE',
    skills: ['RAG', 'LLMs', 'NLP', 'AI/ML'] 
  },
  { 
    title: 'AI Orchestration', 
    desc: 'Designing multi-step reasoning pipelines and agent workflows for production-grade AI systems.', 
    tag: 'PIPELINES',
    skills: ['LangChain', 'LangGraph', 'RAG Pipelines', 'Agents'] 
  },
  { 
    title: 'Backend Engineering', 
    desc: 'Building fast, reliable REST APIs and backend services to power AI-driven applications.', 
    tag: 'ARCHITECTURE',
    skills: ['FastAPI', 'Python', 'REST APIs'] 
  },
  { 
    title: 'Databases', 
    desc: 'Designing and querying relational databases to support scalable backend systems.', 
    tag: 'STORAGE',
    skills: ['PostgreSQL', 'SQL'] 
  },
  { 
    title: 'Data Analytics', 
    desc: 'Analyzing and processing data to extract insights using Python\'s data science ecosystem.', 
    tag: 'INSIGHTS',
    skills: ['Python', 'Pandas', 'NumPy'] 
  },
  { 
    title: 'Programming Languages & Tools', 
    desc: 'Comfortable across multiple languages and equipped with industry-standard version control tooling.', 
    tag: 'FOUNDATIONS',
    skills: ['Java', 'Python', 'C', 'C++', 'Git', 'GitHub'] 
  },
];

// Converts the backend's shape (title, description, tag_label, skills as a
// comma-separated string) into the shape this component renders with.
function mapFromBackend(items) {
  return items.map((item) => ({
    title: item.title,
    desc: item.description,
    tag: item.tag_label,
    skills: (item.skills || '').split(',').map((s) => s.trim()).filter(Boolean),
  }));
}

const Skills = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [skillCategories, setSkillCategories] = useState(DEFAULT_SKILLS);

  useEffect(() => {
    fetchContent('/skills', null).then((data) => {
      if (data && data.length > 0) {
        setSkillCategories(mapFromBackend(data));
      } else {
        setSkillCategories(DEFAULT_SKILLS);
      }
    });
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Simple, calm fade-and-rise entrance as the section scrolls into view.
      // No pinning, no scrubbing, no scroll-jacking - plays once and gets out of the way.
      gsap.set(cardsRef.current, { opacity: 0, y: 40 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(cardsRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            stagger: 0.12,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [skillCategories]);

  return (
    <section 
      id="skills"
      ref={sectionRef} 
      className="relative w-full bg-[#0f1729] text-white py-24 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-500 font-bold">Skill Set</span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2">Core Skills</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, i) => (
            <div 
              key={i}
              ref={el => cardsRef.current[i] = el}
              className="p-8 bg-[#131c31]/95 border border-white/15 rounded-[24px] flex flex-col justify-between overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-blue-600/80 transition-colors duration-500"
            >
              {/* Top Card Metadata */}
              <div className="flex items-center justify-between relative z-10 mb-5">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-blue-500 bg-blue-600/10 px-3 py-1 rounded border border-blue-600/20">
                  {category.tag}
                </span>
                <span className="text-xs font-mono text-white/40">
                  [ {String(i + 1).padStart(2, '0')} / {String(skillCategories.length).padStart(2, '0')} ]
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3 relative z-10 mb-6">
                <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-blue-500 transition-colors duration-300">
                  {category.title}
                </h3>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  {category.desc}
                </p>
              </div>

              {/* Bottom Skill Badges */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10 relative z-10">
                {category.skills.map((skill, sIdx) => (
                  <span 
                    key={sIdx}
                    className="text-xs font-mono text-white/80 bg-white/5 border border-white/10 px-3 py-1 rounded group-hover:border-blue-600/30 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
