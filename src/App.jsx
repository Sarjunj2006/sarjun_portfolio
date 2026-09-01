import { useState } from 'react';
import NetflixPreloader from './components/NetflixPreloader';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigate = (section) => {
    setActiveSection(section);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <About />;
      case 'expertise':
        return <Expertise />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      case 'home':
      default:
        return <Hero onNavigate={handleNavigate} />;
    }
  };

  return (
    <main className="bg-[#0a0e1a] min-h-screen text-white relative cursor-none selection:bg-blue-600 selection:text-white">
      {/* Cinematic Preloader */}
      {loading && <NetflixPreloader onComplete={() => setLoading(false)} />}

      {/* Global Mouse Hover Effects & Spotlight across ALL sections */}
      <CustomCursor />

      {/* Fixed Navbar - instantly switches pages, no scrolling */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Only the active page renders */}
      {renderSection()}

      <Footer onNavigate={handleNavigate} />
    </main>
  );
}

export default App;
