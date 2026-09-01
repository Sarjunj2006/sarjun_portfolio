import { useEffect, useState } from 'react';
import { fetchContent } from '../lib/api';

// Fallback content shown if the CMS backend isn't running
const DEFAULT_SOCIAL = {
  github_url: "https://github.com/Sarjunj2006",
  linkedin_url: "",
  email: "",
  twitter_url: "",
};

const Footer = ({ onNavigate }) => {
  const [social, setSocial] = useState(DEFAULT_SOCIAL);

  useEffect(() => {
    fetchContent('/social-links', DEFAULT_SOCIAL).then(setSocial);
  }, []);

  return (
    <footer className="bg-[#0a0e1a] text-white py-16 px-6 md:px-12 border-t border-white/15 select-none relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col space-y-12">
        
        {/* Top Section: Brand & Quick Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-white/15">
          <div className="space-y-2">
            <div className="text-2xl font-black text-blue-600 tracking-tighter flex items-center gap-2 drop-shadow-[0_2px_15px_rgba(37,99,235,0.9)]">
              SARJUN J<span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
            </div>
            <p className="text-xs font-mono text-white/50 tracking-widest uppercase">
              // AI ENGINEER PORTFOLIO &bull; 2026
            </p>
          </div>

          {/* Quick Navigation Links */}
          <nav className="flex flex-wrap gap-6 md:gap-8 text-xs font-mono uppercase tracking-widest text-white/70">
            <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-blue-500 transition-colors cursor-pointer">Home</button>
            <button onClick={() => onNavigate && onNavigate('about')} className="hover:text-blue-500 transition-colors cursor-pointer">About</button>
            <button onClick={() => onNavigate && onNavigate('expertise')} className="hover:text-blue-500 transition-colors cursor-pointer">Expertise</button>
            <button onClick={() => onNavigate && onNavigate('skills')} className="hover:text-blue-500 transition-colors cursor-pointer">Skills</button>
            <button onClick={() => onNavigate && onNavigate('projects')} className="hover:text-blue-500 transition-colors cursor-pointer">Projects</button>
            <button onClick={() => onNavigate && onNavigate('contact')} className="hover:text-blue-500 transition-colors cursor-pointer">Contact</button>
          </nav>
        </div>

        {/* Middle Section: Socials & External Profiles */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs font-mono text-white/60">
          <div className="flex items-center gap-6 flex-wrap">
            {social.github_url && (
              <a 
                href={social.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors uppercase tracking-wider"
              >
                GitHub //
              </a>
            )}
            {social.linkedin_url && (
              <a 
                href={social.linkedin_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors uppercase tracking-wider"
              >
                LinkedIn //
              </a>
            )}
            {social.twitter_url && (
              <a 
                href={social.twitter_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors uppercase tracking-wider"
              >
                Twitter //
              </a>
            )}
            {social.email && (
              <button
                onClick={() => onNavigate && onNavigate('contact')}
                className="hover:text-blue-500 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Email //
              </button>
            )}
          </div>
        </div>

        {/* Bottom Copyright & Cinematic Tagline */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10 text-[11px] font-mono text-white/40 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Sarjun J. All Rights Reserved.</p>
          <p className="text-blue-500/80">BUILT WITH REACT & GSAP</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;