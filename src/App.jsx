import { Outlet } from "react-router-dom"
import Nav from "./components/Nav"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

function App() {
  const [isMobileLayout, setIsMobileLayout] = useState(window.innerWidth < 768);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDesktopNavExpanded, setIsDesktopNavExpanded] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobileLayout = window.innerWidth < 768;
      setIsMobileLayout(mobileLayout);
      if (!mobileLayout) {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navOpen = isMobileLayout ? isMobileNavOpen : isDesktopNavExpanded;
  const setNavOpen = isMobileLayout ? setIsMobileNavOpen : setIsDesktopNavExpanded;

  return (
    <div className={`flex h-screen bg-gray-100 ${isMobileLayout && isMobileNavOpen ? 'overflow-hidden' : ''}`}>
      <ScrollToTop />

      {isMobileLayout && (
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-md shadow-md md:hidden"
          aria-label="Abrir menu"
        >
          <FiMenu className="h-6 w-6 text-gray-700" />
        </button>
      )}

      <Nav 
        navOpen={navOpen} 
        setNavOpen={setNavOpen} 
        isMobileLayout={isMobileLayout} 
      />

      {isMobileLayout && isMobileNavOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileNavOpen(false)}
        ></div>
      )}
      
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${
        isMobileLayout ? 'ml-0' : (isDesktopNavExpanded ? 'ml-[225px]' : 'ml-[76px]')
      }`}>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default App