// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Rola a página para o topo com comportamento suave
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // opcional: adiciona uma transição suave
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
