import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fetchContent } from '../lib/api';

gsap.registerPlugin(ScrollTrigger);

// Fallback content shown if the CMS backend isn't running or has no data yet
const DEFAULT_PROJECTS = [
  {
    title: "AI Career Mentor",
    category: "AI & Full-Stack Engineering",
    description: "A full-stack career guidance app using prompt engineering with context injection (resume + profile data) for AI-driven career analysis, skill-gap detection, and interview prep.",
    tags: ["FastAPI", "React", "SQLAlchemy", "Ollama"],
    index: "01",
    links: {
      frontend: "https://github.com/Sarjunj2006/ai-career-mentor-frontend",
      backend: "https://github.com/Sarjunj2006/ai-career-mentor"
    },
    caseStudy: {
      problem: "Job seekers get generic career advice that ignores their actual resume, so they can't tell which specific skills to close before an interview.",
      whoBenefits: "Job seekers, career changers, and students preparing for technical interviews.",
      timeSaved: "Cuts hours of manual resume review and interview research down to a single guided session.",
      roi: "Faster, better-targeted prep means fewer wasted applications and quicker time-to-offer.",
      approach: "Injects the user's resume and profile as context into an LLM prompt pipeline for tailored skill-gap analysis and interview questions."
    }
  },
  {
    title: "RepurposeAI",
    category: "Multi-Tenant AI Platform",
    description: "A multi-tenant AI content repurposer: upload a blog post or video transcript and AI turns it into tweets, LinkedIn posts, and email newsletters, with tenant-specific tone settings.",
    tags: ["Python", "FastAPI", "LangChain", "PostgreSQL"],
    index: "02",
    links: {
      repo: "https://github.com/Sarjunj2006/repurposer_ai"
    },
    caseStudy: {
      problem: "Creators and marketing teams spend hours manually rewriting one piece of content into every platform's format.",
      whoBenefits: "Content creators, marketing teams, and agencies juggling multiple brand voices.",
      timeSaved: "Turns a blog post or transcript into tweets, LinkedIn posts, and a newsletter in seconds instead of an afternoon.",
      roi: "Multiplies content output from the same input effort, directly cutting content-ops cost per asset.",
      approach: "Multi-tenant LangChain pipeline with tenant-specific tone settings, backed by FastAPI and PostgreSQL."
    }
  }
];

// Converts the backend's shape (tags as a comma-separated string, separate
// link fields) into the shape this component renders with. Case-study
// fields are optional on the backend right now - if absent, we fall back
// to a generic prompt so the modal still has something useful to show.
function mapFromBackend(items) {
  return items.map((item, i) => ({
    title: item.title,
    category: item.category,
    description: item.description,
    tags: (item.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    index: String(i + 1).padStart(2, '0'),
    links: {
      frontend: item.frontend_link || undefined,
      backend: item.backend_link || undefined,
      repo: item.repo_link || undefined,
    },
    caseStudy: {
      problem: item.problem || "Add a 'problem' field in the admin panel to describe what this project solves.",
      whoBenefits: item.who_benefits || "Add a 'who_benefits' field to describe the target users.",
      timeSaved: item.time_saved || "Add a 'time_saved' field to quantify the efficiency gain.",
      roi: item.roi || "Add an 'roi' field to describe the return on investment for users.",
      approach: item.description,
    },
  }));
}

const Projects = () => {
  const containerRef = useRef(null);
  const folderBackRef = useRef(null);
  const folderFrontRef = useRef(null);
  const cardsRef = useRef([]);
  const mobileCardsRef = useRef([]);
  const mobileCarouselRef = useRef(null);
  const [projectsData, setProjectsData] = useState(DEFAULT_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchContent('/projects', null).then((data) => {
      if (data && data.length > 0) {
        setProjectsData(mapFromBackend(data));
      } else {
        setProjectsData(DEFAULT_PROJECTS);
      }
    });
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Set initial origins (Centered in viewport)
      gsap.set([folderBackRef.current, folderFrontRef.current], { 
        xPercent: -50, 
        yPercent: -50 
      });
      gsap.set(folderFrontRef.current, { transformOrigin: "bottom center" });
      
      const getGridPos = (index) => {
        // Centers cards side-by-side in a single row, works for any small count
        const count = projectsData.length;
        return { row: 0, col: index - (count - 1) / 2 };
      };

      cardsRef.current.forEach((card) => {
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          rotation: gsap.utils.random(-6, 6),
          scale: 0.85,
          x: 0,
          y: 0,
        });
      });

      let mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        let { isDesktop, isMobile } = context.conditions;

        if (isDesktop) {
          let floatTween;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 50%", 
              end: "bottom 50%",
              toggleActions: "play reverse play reverse",
              onEnter: () => { if (floatTween) floatTween.kill(); },
              onEnterBack: () => { if (floatTween) floatTween.kill(); },
              onLeave: () => { if (floatTween) floatTween.kill(); },
              onLeaveBack: () => { if (floatTween) floatTween.kill(); }
            },
            onComplete: () => {
              floatTween = gsap.to(cardsRef.current, {
                y: "+=12",
                rotation: "+=1",
                duration: 3.5,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
                stagger: { amount: 1.5, from: "random" }
              });
            }
          });

          // 1. Folder opens with smooth rotation
          tl.to(folderFrontRef.current, {
            rotationX: -130,
            duration: 1.2,
            ease: "power3.inOut"
          });

          // 2. Cards rise up collectively
          tl.to(cardsRef.current, {
            y: -140,
            scale: 0.9,
            zIndex: 70,
            duration: 0.6,
            stagger: 0.04,
            ease: "back.out(1.2)"
          }, "-=0.6");

          // 3. Cards magically spread out into an ultra-clean blockbuster grid layout
          tl.to(cardsRef.current, {
            x: (i) => {
              const w = Math.max(...cardsRef.current.map(c => c?.offsetWidth || 0)) || 360;
              const gap = 40;
              const { col } = getGridPos(i);
              return col * (w + gap);
            },
            y: (i) => {
              const h = Math.max(...cardsRef.current.map(c => c?.offsetHeight || 0)) || 240;
              const gap = 40;
              const { row } = getGridPos(i);
              return row * (h + gap);
            },
            rotation: () => gsap.utils.random(-3, 3),
            scale: 1,
            duration: 1.4,
            stagger: { amount: 0.4, from: "center" },
            ease: "expo.out"
          }, "-=0.2");
        }

        if (isMobile) {
          const cardW = window.innerWidth * 0.8;
          const gap = 20;
          
          mobileCardsRef.current.forEach((card, i) => {
            gsap.set(card, {
              x: -(i * (cardW + gap)), 
              y: 0,
              scale: 0.4,
              opacity: 0,
              rotation: gsap.utils.random(-15, 15)
            });
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 60%",
            }
          });

          tl.to(folderFrontRef.current, {
            rotationX: -130,
            duration: 0.8,
            ease: "power3.inOut"
          });

          tl.to(mobileCardsRef.current, {
            y: -100,
            opacity: 1,
            scale: 0.85,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.2)"
          }, "-=0.4");

          tl.to(mobileCardsRef.current, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: (i) => i === 0 ? 1 : 0.92,
            opacity: (i) => i === 0 ? 1 : 0.5,
            duration: 0.8,
            stagger: 0.08,
            ease: "expo.out",
            onComplete: () => {
              if (mobileCarouselRef.current) {
                mobileCarouselRef.current.style.overflowX = 'auto';
                mobileCarouselRef.current.style.pointerEvents = 'auto';
              }
            }
          }, "-=0.2");
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [projectsData]);

  return (
    <section id="projects" ref={containerRef} className="bg-[#eef2f9] min-h-[100svh] md:min-h-[170vh] relative font-sans overflow-x-clip text-[#16233f] w-full flex items-center justify-center py-24 md:py-40 select-none">
      
      {/* Background Netflix Cinematic Title Watermark */}
      <div className="absolute top-10 left-0 w-full flex items-start justify-center pointer-events-none z-0">
        <h1 className="text-[14vw] sm:text-[17vw] md:text-[20vw] font-black text-[#16233f]/[0.04] tracking-tighter leading-none whitespace-nowrap uppercase">
          ORIGINALS
        </h1>
      </div>

      {/* Ambient Crimson Glow behind folder */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Main Perspective Container */}
      <div className="mt-12 relative w-full max-w-7xl h-full flex items-center justify-center perspective-[2000px] z-10">
        
        {/* Origin Container */}
        <div className="relative w-0 h-0 transform-style-3d">
          
          {/* Folder Back */}
          <div 
            ref={folderBackRef}
            className="absolute w-[85vw] md:w-[32vw] max-w-[380px] aspect-video bg-[#ffffff] rounded-[24px] border border-blue-600/40 shadow-[0_20px_50px_rgba(37,99,235,0.25)] flex items-center justify-center"
            style={{ zIndex: 5 }}
          >
            <div className="absolute -top-6 left-6 w-32 h-8 bg-[#e2e8f2] rounded-t-xl border-t border-blue-600/30" />
            <div className="relative z-10 text-blue-600 font-mono font-black text-2xl tracking-widest uppercase opacity-60">
              ARCHIVE_SLOTS
            </div>
          </div>

          {/* Desktop Project Cards */}
          {projectsData.map((project, i) => (
            <div 
              key={i}
              ref={el => cardsRef.current[i] = el}
              className="hidden md:block absolute w-[80vw] md:w-[33vw] max-w-[380px] aspect-[16/10] will-change-transform"
              style={{ zIndex: 10 + i }}
            >
              <div
                onClick={() => setSelectedProject(project)}
                className="w-full h-full rounded-[24px] overflow-hidden border border-slate-200 bg-[#ffffff]/95 backdrop-blur-2xl shadow-[0_25px_50px_rgba(30,41,59,0.10)] transition-all duration-500 group hover:scale-[1.04] hover:border-blue-600 hover:shadow-[0_35px_80px_rgba(37,99,235,0.35)] hover:-translate-y-2 cursor-pointer relative z-10 p-7 flex flex-col justify-between">
                
                {/* Top Card Header */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-blue-500 bg-blue-600/10 px-2.5 py-1 rounded border border-blue-600/20">
                    {project.index}
                  </span>
                </div>

                {/* Middle Title & Description */}
                <div className="space-y-2 my-auto">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#16233f]/50">
                    {project.category}
                  </div>
                  <h3 className="text-2xl font-black text-[#16233f] tracking-tight group-hover:text-blue-500 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#16233f]/70 font-light leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Bottom Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200">
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono text-[#16233f]/70 bg-[#16233f]/8 px-2 py-0.5 rounded group-hover:border-blue-600/30 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* GitHub Links (only shown if provided) */}
                {project.links && (
                  <div className="flex flex-wrap gap-3 pt-3 relative z-20">
                    {project.links.frontend && (
                      <a
                        href={project.links.frontend}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] font-mono uppercase tracking-widest text-blue-500 hover:text-[#16233f] transition-colors"
                      >
                        Frontend Repo &rarr;
                      </a>
                    )}
                    {project.links.backend && (
                      <a
                        href={project.links.backend}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] font-mono uppercase tracking-widest text-blue-500 hover:text-[#16233f] transition-colors"
                      >
                        Backend Repo &rarr;
                      </a>
                    )}
                    {project.links.repo && (
                      <a
                        href={project.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] font-mono uppercase tracking-widest text-blue-500 hover:text-[#16233f] transition-colors"
                      >
                        View Repo &rarr;
                      </a>
                    )}
                  </div>
                )}

                {/* Case Study Hint */}
                <div className="pt-2 relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold group-hover:underline">
                    View Case Study &rarr;
                  </span>
                </div>

                {/* Red Glowing Corner Accent */}
                <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-blue-600 group-hover:shadow-[0_0_15px_#3B82F6] transition-all" />
              </div>
            </div>
          ))}

          {/* Folder Front Flap */}
          <div 
            ref={folderFrontRef}
            className="absolute w-[85vw] md:w-[32vw] max-w-[380px] aspect-video pointer-events-none will-change-transform"
            style={{ zIndex: 60 }}
          >
            <div className="absolute bottom-0 w-full h-[85%] bg-[#e2e8f2] rounded-b-[24px] rounded-t-md shadow-[0_-5px_20px_rgba(30,41,59,0.08)] flex flex-col justify-end p-6 border-t border-blue-600/40">
              <div className="w-20 h-1.5 bg-[#16233f]/15 rounded-full mx-auto mb-2" />
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Swipeable Carousel */}
      <div 
        ref={mobileCarouselRef}
        className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-auto py-12 flex items-center gap-6 px-[12.5vw] pointer-events-none z-[100] snap-x snap-mandatory overflow-x-hidden hide-scrollbar"
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        {projectsData.map((project, i) => (
          <div 
            key={`mob-${i}`}
            ref={el => mobileCardsRef.current[i] = el}
            className="shrink-0 w-[78vw] aspect-[16/11] snap-center will-change-transform relative z-10"
          >
            <div
              onClick={() => setSelectedProject(project)}
              className="w-full h-full rounded-[24px] overflow-hidden border border-slate-200 bg-[#ffffff] p-6 flex flex-col justify-between shadow-[0_20px_40px_rgba(30,41,59,0.10)] cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-widest text-blue-500 bg-blue-600/10 px-2 py-0.5 rounded">
                  {project.index}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-[#16233f]">{project.title}</h3>
                <p className="text-xs text-[#16233f]/70 font-light line-clamp-2">{project.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-200">
                {project.tags.slice(0, 3).map((tag, tIdx) => (
                  <span key={tIdx} className="text-[10px] font-mono text-[#16233f]/65 bg-[#16233f]/8 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold pt-1">
                View Case Study &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Project Case Study Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedProject(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#16233f]/40 backdrop-blur-sm"></div>

          {/* Modal Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-[28px] border border-slate-200 shadow-[0_40px_100px_rgba(30,41,59,0.25)] p-8 md:p-10"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-[#16233f]/8 hover:bg-[#16233f]/15 text-[#16233f] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-8 pr-12">
              <div className="text-[11px] font-mono uppercase tracking-widest text-blue-500 font-bold mb-2">
                {selectedProject.category}
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-[#16233f] tracking-tight leading-tight">
                {selectedProject.title}
              </h3>
              <p className="mt-3 text-sm text-[#16233f]/70 font-light leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Case Study Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-[#eef2f9] border border-slate-200">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-blue-500 font-bold mb-2">Problem It Solves</h4>
                <p className="text-sm text-[#16233f]/80 leading-relaxed">{selectedProject.caseStudy?.problem}</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#eef2f9] border border-slate-200">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-blue-500 font-bold mb-2">Who Benefits</h4>
                <p className="text-sm text-[#16233f]/80 leading-relaxed">{selectedProject.caseStudy?.whoBenefits}</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#eef2f9] border border-slate-200">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-blue-500 font-bold mb-2">Time Saved</h4>
                <p className="text-sm text-[#16233f]/80 leading-relaxed">{selectedProject.caseStudy?.timeSaved}</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#eef2f9] border border-slate-200">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-blue-500 font-bold mb-2">ROI</h4>
                <p className="text-sm text-[#16233f]/80 leading-relaxed">{selectedProject.caseStudy?.roi}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-6 pt-6 border-t border-slate-200">
              {selectedProject.tags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] font-mono text-[#16233f]/70 bg-[#16233f]/8 px-2.5 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>

            {/* Links */}
            {selectedProject.links && (
              <div className="flex flex-wrap gap-5 mt-5">
                {selectedProject.links.frontend && (
                  <a href={selectedProject.links.frontend} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-mono uppercase tracking-widest text-blue-500 hover:text-[#16233f] transition-colors">
                    Frontend Repo &rarr;
                  </a>
                )}
                {selectedProject.links.backend && (
                  <a href={selectedProject.links.backend} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-mono uppercase tracking-widest text-blue-500 hover:text-[#16233f] transition-colors">
                    Backend Repo &rarr;
                  </a>
                )}
                {selectedProject.links.repo && (
                  <a href={selectedProject.links.repo} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-mono uppercase tracking-widest text-blue-500 hover:text-[#16233f] transition-colors">
                    View Repo &rarr;
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
};

export default Projects;