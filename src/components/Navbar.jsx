import { useEffect, useState } from 'react';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = ({ activeSection, onNavigate }) => {
  const [isDark, setIsDark] = useState(false);

  // On mount: use the saved preference, or fall back to the system setting.
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', dark);
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const ThemeIcon = () => (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--text-primary)]/5 hover:bg-[var(--text-primary)]/10 transition-colors cursor-pointer"
    >
      {isDark ? (
        <svg className="w-4 h-4 text-[var(--text-primary)]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1Z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-[var(--text-primary)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      )}
    </button>
  );

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[var(--bg-page)]/90 backdrop-blur-2xl border-b border-[var(--border-color)]/80">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="text-2xl font-black text-blue-600 tracking-tighter flex items-center gap-2 drop-shadow-[0_2px_15px_rgba(37,99,235,0.9)] cursor-pointer"
        >
          SARJUN J<span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
        </button>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-[var(--text-primary)]/80">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`transition-colors cursor-pointer ${
                activeSection === item.id ? 'text-blue-500' : 'hover:text-blue-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeIcon />
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            Hire Me
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <nav className="md:hidden flex items-center justify-center gap-4 pb-3 text-[10px] font-mono uppercase tracking-widest text-[var(--text-primary)]/80 overflow-x-auto px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === item.id ? 'text-blue-500' : 'hover:text-blue-500'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
