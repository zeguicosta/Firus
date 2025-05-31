import React, { useState, useEffect } from 'react';
import BrazilMapRaw from '../assets/brazil.svg?react'; // Vite-specific import for SVGs as React components

console.log('Type of imported BrazilMapRaw:', typeof BrazilMapRaw);
console.log('Value of imported BrazilMapRaw:', BrazilMapRaw);

// Assign to a capitalized variable name for JSX, only if it's a function/component
const BrazilMap = typeof BrazilMapRaw === 'function' || (typeof BrazilMapRaw === 'object' && BrazilMapRaw !== null && typeof BrazilMapRaw.render === 'function') 
                  ? BrazilMapRaw 
                  : null;

if (!BrazilMap) {
  console.error('BrazilMap did not load as a React component. Imported value:', BrazilMapRaw);
}

export function Home() {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  const handleStateClick = (event) => {
    let target = event.target;
    let stateName = null;
    while (target && target.tagName !== 'svg') {
      if (target.tagName === 'path') {
        stateName = target.getAttribute('id') || target.getAttribute('name') || target.dataset.name; // Check common attributes
        if (stateName) break;
      }
      target = target.parentElement;
    }
    console.log('Clicked path, identified state name:', stateName);
    if (stateName) setSelectedState(stateName);
    else console.log('Clicked on map background or unidentified area. Target:', event.target);
  };
  
  const handleStateMouseOver = (event) => {
    let target = event.target;
    if (target.tagName === 'path') {
      const stateName = target.getAttribute('id') || target.getAttribute('name') || target.dataset.name;
      if (stateName) setHoveredState(stateName);
    }
  };

  const handleStateMouseOut = () => {
    setHoveredState(null);
  };

  const mapContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #ccc',
  };

  useEffect(() => {
    const svgMap = document.querySelector('.brazil-map-svg');
    if (svgMap) {
      const paths = svgMap.querySelectorAll('path');
      paths.forEach(path => {
        const stateName = path.getAttribute('id') || path.getAttribute('name') || path.dataset.name;
        path.style.stroke = '#333333';
        path.style.strokeWidth = '0.5px'; // Thinner stroke
        path.style.cursor = 'pointer';

        if (selectedState === stateName) {
          path.style.fill = '#059669';
        } else if (hoveredState === stateName) {
          path.style.fill = '#A9A9A9';
        } else {
          path.style.fill = '#cccccc';
        }
      });
    }
  }, [selectedState, hoveredState, BrazilMap]); // Add BrazilMap to dependency array to re-run if it changes

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Queimadas no Brasil</h1>
      
      <div 
        style={mapContainerStyle} 
        onClick={handleStateClick} 
        onMouseOver={handleStateMouseOver} 
        onMouseOut={handleStateMouseOut}
                >
        {BrazilMap ? (
          <BrazilMap className="brazil-map-svg" width="100%" />
        ) : (
          <p>Error: Brazil map could not be loaded as a component. Please check console.</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Dados do Estado Selecionado</h2>
        {selectedState ? (
          <p>Estado selecionado: <span className="font-semibold">{selectedState}</span></p>
        ) : (
          <p>Clique em um estado para ver os dados.</p>
        )}
            </div>
        </div>
  );
}

export default Home;
