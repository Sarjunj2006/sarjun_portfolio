const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = ({ activeSection, onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-[#0a0e1a]/90 backdrop-blur-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="text-2xl font-black text-blue-600 tracking-tighter flex items-center gap-2 drop-shadow-[0_2px_15px_rgba(37,99,235,0.9)] cursor-pointer"
        >
          SARJUN J<span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
        </button>

        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-white/80">
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

        <button
          onClick={() => onNavigate('contact')}
          className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          Hire Me
        </button>
      </div>

      {/* Mobile nav row */}
      <nav className="md:hidden flex items-center justify-center gap-4 pb-3 text-[10px] font-mono uppercase tracking-widest text-white/80 overflow-x-auto px-4">
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
