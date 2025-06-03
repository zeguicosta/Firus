import React, { useState, useEffect } from 'react';
import BrazilMapRaw from '../assets/brazil.svg?react'; // Vite-specific import for SVGs as React components
import BiomeDoughnutChart from '../components/charts/BiomeDoughnutChart'; // Import the chart component
import StateYearComparisonChart from '../components/charts/StateYearComparisonChart'; // Import the new chart
import NationalHotspotCountCard from '../components/cards/NationalHotspotCountCard'; // New Card
import TopStatesBarChart from '../components/charts/TopStatesBarChart'; // New Chart
import NationalTrendLineChart from '../components/charts/NationalTrendLineChart'; // New import
import MonthlyHotspotChart from '../components/charts/MonthlyHotspotChart'; // New import

console.log('Type of imported BrazilMapRaw:', typeof BrazilMapRaw);
console.log('Value of imported BrazilMapRaw:', BrazilMapRaw);

// Helper to normalize state names from CSV (uppercase, remove accents for a robust match if needed)
// For now, we assume CSV names are like "BAHIA", "CEARÁ"
// This mapping helps connect SVG IDs (like BR-AC) to CSV state names (like ACRE)
const stateIdToCsvName = {
  "BR-AC": "ACRE",
  "BR-AL": "ALAGOAS",
  "BR-AP": "AMAPÁ", // Adjusted: Using accented uppercase
  "BR-AM": "AMAZONAS",
  "BR-BA": "BAHIA",
  "BR-CE": "CEARÁ", // Adjusted: Using accented uppercase
  "BR-DF": "DISTRITO FEDERAL",
  "BR-ES": "ESPÍRITO SANTO", // Adjusted: Using accented uppercase
  "BR-GO": "GOIÁS", // Adjusted: Using accented uppercase
  "BR-MA": "MARANHÃO", // Adjusted: Using accented uppercase
  "BR-MT": "MATO GROSSO",
  "BR-MS": "MATO GROSSO DO SUL",
  "BR-MG": "MINAS GERAIS",
  "BR-PA": "PARÁ", // Adjusted: Using accented uppercase
  "BR-PB": "PARAÍBA", // Adjusted: Using accented uppercase
  "BR-PR": "PARANÁ", // Adjusted: Using accented uppercase
  "BR-PE": "PERNAMBUCO",
  "BR-PI": "PIAUÍ", // Adjusted: Using accented uppercase
  "BR-RJ": "RIO DE JANEIRO",
  "BR-RN": "RIO GRANDE DO NORTE",
  "BR-RS": "RIO GRANDE DO SUL",
  "BR-RO": "RONDÔNIA", // Adjusted: Using accented uppercase
  "BR-RR": "RORAIMA",
  "BR-SC": "SANTA CATARINA",
  "BR-SP": "SÃO PAULO", // Adjusted: Using accented uppercase
  "BR-SE": "SERGIPE",
  "BR-TO": "TOCANTINS",
};

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
  
  const [focosDataByState2024, setFocosDataByState2024] = useState(null);
  const [focosDataByBiome2024, setFocosDataByBiome2024] = useState(null);
  const [totalFocosBrasil2024, setTotalFocosBrasil2024] = useState(0); // New state

  const [focosDataByState2023, setFocosDataByState2023] = useState(null);
  const [focosDataByBiome2023, setFocosDataByBiome2023] = useState(null);
  const [totalFocosBrasil2023, setTotalFocosBrasil2023] = useState(0); // New state

  const [focosDataByState2022, setFocosDataByState2022] = useState(null);
  const [focosDataByBiome2022, setFocosDataByBiome2022] = useState(null);
  const [totalFocosBrasil2022, setTotalFocosBrasil2022] = useState(0); // New state

  // New states for monthly data
  const [focosDataByMonth2024, setFocosDataByMonth2024] = useState(null);
  const [focosDataByMonth2023, setFocosDataByMonth2023] = useState(null);
  const [focosDataByMonth2022, setFocosDataByMonth2022] = useState(null);

  // States for 2021 data
  const [focosDataByState2021, setFocosDataByState2021] = useState(null);
  const [focosDataByBiome2021, setFocosDataByBiome2021] = useState(null);
  const [totalFocosBrasil2021, setTotalFocosBrasil2021] = useState(0);
  const [focosDataByMonth2021, setFocosDataByMonth2021] = useState(null);

  // States for 2020 data
  const [focosDataByState2020, setFocosDataByState2020] = useState(null);
  const [focosDataByBiome2020, setFocosDataByBiome2020] = useState(null);
  const [totalFocosBrasil2020, setTotalFocosBrasil2020] = useState(0);
  const [focosDataByMonth2020, setFocosDataByMonth2020] = useState(null);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorLoadingData, setErrorLoadingData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2024); 

  useEffect(() => {
    const parseCsvData = (csvText, year) => {
      const lines = csvText.trim().split('\n');
      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const dataLines = lines.slice(1);

      const dataPasColumnIndex = header.findIndex(h => h === 'data_pas'); // Find data_pas column
      const estadoColumnIndex = header.findIndex(h => h === 'estado');
      const biomaColumnIndex = header.findIndex(h => h === 'bioma');

      if (dataPasColumnIndex === -1) {
        console.warn(`Coluna "data_pas" não encontrada no CSV de ${year}. Dados mensais não serão gerados.`);
      }
      if (estadoColumnIndex === -1) {
        throw new Error(`Coluna "estado" não encontrada no CSV de ${year}. Cabeçalho: ${header.join(', ')}`);
      }
      if (biomaColumnIndex === -1) {
        throw new Error(`Coluna "bioma" não encontrada no CSV de ${year}. Cabeçalho: ${header.join(', ')}`);
      }

      const focosByState = {};
      const focosByBiomeData = {};
      let totalFocosNacional = 0;
      const focosByMonth = Array(12).fill(0); // Initialize array for 12 months

      dataLines.forEach(line => {
        const columns = line.split(',');
        
        // Increment monthly count if data_pas is available
        if (dataPasColumnIndex !== -1 && columns.length > dataPasColumnIndex && columns[dataPasColumnIndex]) {
          try {
            // Assuming data_pas is in a format that new Date() can parse, e.g., YYYY-MM-DD or YYYY/MM/DD
            // The CSV seems to use YYYY-MM-DD HH:MM:SS or similar.
            const dateString = columns[dataPasColumnIndex].split(' ')[0]; // Get only date part if timestamp exists
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) { // Check if date is valid
              const month = date.getMonth(); // 0-11
              focosByMonth[month] = (focosByMonth[month] || 0) + 1;
            }
          } catch (e) {
            console.warn(`Erro ao processar data_pas "${columns[dataPasColumnIndex]}" na linha: ${line}`, e);
          }
        }

        if (columns.length > estadoColumnIndex && columns[estadoColumnIndex]) {
          const estadoFromCsv = columns[estadoColumnIndex].trim().toUpperCase();
          focosByState[estadoFromCsv] = (focosByState[estadoFromCsv] || 0) + 1;
          totalFocosNacional += 1; // Increment national total
        }

        if (columns.length > biomaColumnIndex && columns[biomaColumnIndex]) {
          const biomaFromCsv = columns[biomaColumnIndex].trim();
          if (biomaFromCsv) {
              focosByBiomeData[biomaFromCsv] = (focosByBiomeData[biomaFromCsv] || 0) + 1;
          }
        }
      });
      return { focosByState, focosByBiomeData, totalFocosNacional, focosByMonth };
    };

    const fetchData = async () => {
      setIsLoadingData(true);
      setErrorLoadingData(null);
      try {
        const [response2024, response2023, response2022, response2021, response2020] = await Promise.all([
          fetch('/data/focos_br_ref_2024.csv'),
          fetch('/data/focos_br_ref_2023.csv'),
          fetch('/data/focos_br_ref_2022.csv'),
          fetch('/data/focos_br_ref_2021.csv'), // Fetch 2021 data
          fetch('/data/focos_br_ref_2020.csv')  // Fetch 2020 data
        ]);

        if (!response2024.ok) {
          throw new Error(`HTTP error! status: ${response2024.status} para dados de 2024`);
        }
        if (!response2023.ok) {
          throw new Error(`HTTP error! status: ${response2023.status} para dados de 2023`);
        }
        if (!response2022.ok) {
          throw new Error(`HTTP error! status: ${response2022.status} para dados de 2022`);
        }
        if (!response2021.ok) {
          throw new Error(`HTTP error! status: ${response2021.status} para dados de 2021`);
        }
        if (!response2020.ok) {
          throw new Error(`HTTP error! status: ${response2020.status} para dados de 2020`);
        }

        const csvText2024 = await response2024.text();
        const csvText2023 = await response2023.text();
        const csvText2022 = await response2022.text();
        const csvText2021 = await response2021.text(); // Added 2021 text
        const csvText2020 = await response2020.text(); // Added 2020 text

        const data2024 = parseCsvData(csvText2024, 2024);
        setFocosDataByState2024(data2024.focosByState);
        setFocosDataByBiome2024(data2024.focosByBiomeData);
        setTotalFocosBrasil2024(data2024.totalFocosNacional);
        setFocosDataByMonth2024(data2024.focosByMonth);

        const data2023 = parseCsvData(csvText2023, 2023);
        setFocosDataByState2023(data2023.focosByState);
        setFocosDataByBiome2023(data2023.focosByBiomeData);
        setTotalFocosBrasil2023(data2023.totalFocosNacional);
        setFocosDataByMonth2023(data2023.focosByMonth);

        const data2022 = parseCsvData(csvText2022, 2022);
        setFocosDataByState2022(data2022.focosByState);
        setFocosDataByBiome2022(data2022.focosByBiomeData);
        setTotalFocosBrasil2022(data2022.totalFocosNacional);
        setFocosDataByMonth2022(data2022.focosByMonth);

        const data2021 = parseCsvData(csvText2021, 2021); // Parse 2021 data
        setFocosDataByState2021(data2021.focosByState);
        setFocosDataByBiome2021(data2021.focosByBiomeData);
        setTotalFocosBrasil2021(data2021.totalFocosNacional);
        setFocosDataByMonth2021(data2021.focosByMonth);

        const data2020 = parseCsvData(csvText2020, 2020); // Parse 2020 data
        setFocosDataByState2020(data2020.focosByState);
        setFocosDataByBiome2020(data2020.focosByBiomeData);
        setTotalFocosBrasil2020(data2020.totalFocosNacional);
        setFocosDataByMonth2020(data2020.focosByMonth);

      } catch (error) {
        console.error('Failed to load or parse CSV data:', error);
        setErrorLoadingData(`Falha ao carregar dados dos focos: ${error.message}`);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleStateClick = (event) => {
    let target = event.target;
    let stateId = null;
    while (target && target.tagName !== 'svg') {
      if (target.tagName === 'path') {
        stateId = target.getAttribute('id') || target.getAttribute('name') || target.dataset.name;
        if (stateId) break;
      }
      target = target.parentElement;
    }
    if (stateId) setSelectedState(stateId);
  };
  
  const handleStateMouseOver = (event) => {
    let target = event.target;
    let stateId = null;
    while (target && target.tagName !== 'svg') {
      if (target.tagName === 'path') {
        stateId = target.getAttribute('id') || target.getAttribute('name') || target.dataset.name;
        if (stateId) break;
      }
      target = target.parentElement;
    }
    // console.log('[handleStateMouseOver] Detected stateId:', stateId); 
    if (stateId) {
      setHoveredState(stateId);
    }
  };

  const handleStateMouseOut = (event) => {
    const svgContainer = event.currentTarget; 
    const relatedTarget = event.relatedTarget;
    let isLeavingMapArea = !relatedTarget || !svgContainer.contains(relatedTarget);
    
    if (!isLeavingMapArea && relatedTarget) {
        if (relatedTarget.tagName === 'path' || relatedTarget.closest('path')) {
            // console.log('[handleStateMouseOut] Mouse moved to another path or within SVG. hoveredState not nulled. Target:', relatedTarget.tagName, relatedTarget.id );
            return; 
        } else {
            isLeavingMapArea = true; 
        }
    }
    if (isLeavingMapArea) {
      // console.log('[handleStateMouseOut] Mouse truly left a path/map area or entered non-path area. Setting hoveredState to null. Related target:', relatedTarget);
      setHoveredState(null);
    } 
  };

  const mapContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    width: '100%',
  };

  useEffect(() => {
    // console.log('[useEffect Map Style] Running. Hovered state:', hoveredState, 'Selected state:', selectedState);
    const svgMap = document.querySelector('.brazil-map-svg');
    if (svgMap && BrazilMap) { 
      const paths = svgMap.querySelectorAll('path');
      paths.forEach(path => {
        const stateId = path.getAttribute('id') || path.getAttribute('name') || path.dataset.name;
        
        let fillColor = '#E5E7EB'; 
        let transformValue = 'scale(1)';

        if (selectedState === stateId) {
          fillColor = '#059669'; 
          transformValue = 'scale(1.05)';
        } else if (hoveredState === stateId) {
          fillColor = '#A7F3D0'; 
          transformValue = 'scale(1.02)';
        }
        
        path.style.fill = fillColor;
        path.style.transform = transformValue;
      });
    }
  }, [selectedState, hoveredState, BrazilMap]);

  // Determine which dataset to use based on selectedYear
  let currentFocosDataByState;
  let currentFocosDataByBiome;
  let currentTotalFocosBrasil;
  let currentFocosByMonth;
  let topStatesDataForChart = [];
  let nationalTrendData = { years: [], totals: [] }; // Prepare data for NationalTrendLineChart
  let availableYears = [2024, 2023, 2022]; // Default, will update if 2020, 2021 data loads

  // Update availableYears if data for older years is present
  if (totalFocosBrasil2021 !== null) availableYears.push(2021);
  if (totalFocosBrasil2020 !== null) availableYears.push(2020);
  availableYears.sort((a,b) => b - a); // Sort descending

  if (selectedYear === 2024) {
    currentFocosDataByState = focosDataByState2024;
    currentFocosDataByBiome = focosDataByBiome2024;
    currentTotalFocosBrasil = totalFocosBrasil2024;
    currentFocosByMonth = focosDataByMonth2024; // Get monthly data for selected year
  } else if (selectedYear === 2023) {
    currentFocosDataByState = focosDataByState2023;
    currentFocosDataByBiome = focosDataByBiome2023;
    currentTotalFocosBrasil = totalFocosBrasil2023;
    currentFocosByMonth = focosDataByMonth2023; // Get monthly data for selected year
  } else if (selectedYear === 2022) {
    currentFocosDataByState = focosDataByState2022;
    currentFocosDataByBiome = focosDataByBiome2022;
    currentTotalFocosBrasil = totalFocosBrasil2022;
    currentFocosByMonth = focosDataByMonth2022; // Get monthly data for selected year
  } else if (selectedYear === 2021) {
    currentFocosDataByState = focosDataByState2021;
    currentFocosDataByBiome = focosDataByBiome2021;
    currentTotalFocosBrasil = totalFocosBrasil2021;
    currentFocosByMonth = focosDataByMonth2021;
  } else if (selectedYear === 2020) {
    currentFocosDataByState = focosDataByState2020;
    currentFocosDataByBiome = focosDataByBiome2020;
    currentTotalFocosBrasil = totalFocosBrasil2020;
    currentFocosByMonth = focosDataByMonth2020;
  } else { 
    // Fallback to latest year if selectedYear is somehow invalid or not yet loaded
    currentFocosDataByState = focosDataByState2024;
    currentFocosDataByBiome = focosDataByBiome2024;
    currentTotalFocosBrasil = totalFocosBrasil2024;
    currentFocosByMonth = focosDataByMonth2024;
    if (!availableYears.includes(selectedYear) && availableYears.length > 0) {
        setSelectedYear(availableYears[0]); // Reset to the latest available year if current selection is bad
    }
  }

  // Prepare data for NationalTrendLineChart if all yearly totals are available
  const trendYears = [];
  const trendTotals = [];
  if (totalFocosBrasil2024 !== null) { trendYears.push('2024'); trendTotals.push(totalFocosBrasil2024); }
  if (totalFocosBrasil2023 !== null) { trendYears.push('2023'); trendTotals.push(totalFocosBrasil2023); }
  if (totalFocosBrasil2022 !== null) { trendYears.push('2022'); trendTotals.push(totalFocosBrasil2022); }
  if (totalFocosBrasil2021 !== null) { trendYears.push('2021'); trendTotals.push(totalFocosBrasil2021); }
  if (totalFocosBrasil2020 !== null) { trendYears.push('2020'); trendTotals.push(totalFocosBrasil2020); }
  
  // Reverse to have chronological order (2020, 2021, ..., 2024) for the line chart
  if (trendYears.length > 0) {
      nationalTrendData = {
          years: trendYears.reverse(),
          totals: trendTotals.reverse()
      };
  }

  // Prepare data for TopStatesBarChart
  if (currentFocosDataByState) {
    topStatesDataForChart = Object.entries(currentFocosDataByState).map(([stateName, count]) => ({
      stateName,
      count
    }));
  }

  let displayData = null;
  let selectedStateNameForDisplay = '';
  let hotspots2020ForSelectedState = 0;
  let hotspots2021ForSelectedState = 0;
  let hotspots2022ForSelectedState = 0;
  let hotspots2023ForSelectedState = 0;
  let hotspots2024ForSelectedState = 0;

  if (selectedState) {
    const csvStateName = stateIdToCsvName[selectedState];
    selectedStateNameForDisplay = csvStateName ? csvStateName.charAt(0).toUpperCase() + csvStateName.slice(1).toLowerCase() : selectedState;

    // Get 2024 data
    if (csvStateName && focosDataByState2024 && focosDataByState2024[csvStateName]) {
      hotspots2024ForSelectedState = focosDataByState2024[csvStateName];
    } else {
      const normalized = csvStateName?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized && focosDataByState2024 && focosDataByState2024[normalized]) {
        hotspots2024ForSelectedState = focosDataByState2024[normalized];
      }
    }
    // Get 2023 data
    if (csvStateName && focosDataByState2023 && focosDataByState2023[csvStateName]) {
      hotspots2023ForSelectedState = focosDataByState2023[csvStateName];
    } else {
      const normalized = csvStateName?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized && focosDataByState2023 && focosDataByState2023[normalized]) {
        hotspots2023ForSelectedState = focosDataByState2023[normalized];
      }
    }
    // Get 2022 data
    if (csvStateName && focosDataByState2022 && focosDataByState2022[csvStateName]) {
      hotspots2022ForSelectedState = focosDataByState2022[csvStateName];
    } else {
      const normalized = csvStateName?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized && focosDataByState2022 && focosDataByState2022[normalized]) {
        hotspots2022ForSelectedState = focosDataByState2022[normalized];
      }
    }
    // Get 2021 data
    if (csvStateName && focosDataByState2021 && focosDataByState2021[csvStateName]) {
      hotspots2021ForSelectedState = focosDataByState2021[csvStateName];
    } else {
      const normalized = csvStateName?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized && focosDataByState2021 && focosDataByState2021[normalized]) {
        hotspots2021ForSelectedState = focosDataByState2021[normalized];
      }
    }
    // Get 2020 data
    if (csvStateName && focosDataByState2020 && focosDataByState2020[csvStateName]) {
      hotspots2020ForSelectedState = focosDataByState2020[csvStateName];
    } else {
      const normalized = csvStateName?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized && focosDataByState2020 && focosDataByState2020[normalized]) {
        hotspots2020ForSelectedState = focosDataByState2020[normalized];
      }
    }
    
    // Set displayData for the selected year's card
    let dataForYearCard = 0;
    if (selectedYear === 2024) dataForYearCard = hotspots2024ForSelectedState;
    else if (selectedYear === 2023) dataForYearCard = hotspots2023ForSelectedState;
    else if (selectedYear === 2022) dataForYearCard = hotspots2022ForSelectedState;
    else if (selectedYear === 2021) dataForYearCard = hotspots2021ForSelectedState;
    else if (selectedYear === 2020) dataForYearCard = hotspots2020ForSelectedState;

    displayData = { focos: dataForYearCard > 0 ? dataForYearCard : 'Dados não disponíveis' };
    if (dataForYearCard === 0 && csvStateName) {
        console.warn(`No data found for state ID ${selectedState} (mapped to ${csvStateName}) in ${selectedYear} focosDataByState.`);
    }
    if (displayData && displayData.focos === 0 && csvStateName) displayData.focos = 'Dados não disponíveis';
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-slate-100 bg-opacity-80 backdrop-blur-md shadow-sm py-4 mb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 text-center sm:text-left whitespace-nowrap">
              Monitoramento de Queimadas
            </h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex space-x-2">
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-150 ease-in-out 
                                ${selectedYear === year 
                                  ? 'bg-emerald-600 text-white shadow-md' 
                                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
              <NationalHotspotCountCard count={currentTotalFocosBrasil} year={selectedYear} isLoading={isLoadingData} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Map */}
          <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Mapa Interativo de Focos ({selectedYear})</h2>
            {isLoadingData && !BrazilMap && <p className="text-center text-slate-600">Carregando mapa...</p>}
            {errorLoadingData && <p className="text-center text-red-500">{errorLoadingData}</p>}
            {!isLoadingData && !errorLoadingData && BrazilMap ? (
              <div 
                style={mapContainerStyle} 
                onClick={handleStateClick} 
                onMouseOver={handleStateMouseOver} 
                onMouseOut={handleStateMouseOut}
              >
                <BrazilMap className="brazil-map-svg w-full" />
          </div>
            ) : (
              !isLoadingData && !errorLoadingData && !BrazilMap && <p className="text-center text-red-500">Erro: Mapa não pôde ser carregado.</p>
            )}
            </div>
            
          {/* Right Column: Selected State Data, Comparison, Biome Chart, Top States Chart */}
          <div className="flex flex-col space-y-6">
            {/* Selected State Info Card */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-slate-700 mb-4">Dados do Estado ({selectedYear})</h2>
              {isLoadingData && <p className="text-slate-600">Carregando dados...</p>}
              {!isLoadingData && selectedState && displayData ? (
                <div>
                  <p className="text-lg font-medium text-emerald-600">
                    Estado: <span className="font-semibold text-slate-800">{selectedStateNameForDisplay}</span>
                  </p>
                  <p className="text-slate-600 mt-2">
                    Total de Focos em {selectedYear}: 
                    <span className="font-bold text-2xl text-emerald-600 ml-2">
                      {typeof displayData.focos === 'number' ? displayData.focos.toLocaleString('pt-BR') : displayData.focos}
                    </span>
              </p>
            </div>
              ) : (
                !isLoadingData && <p className="text-slate-500">Clique em um estado no mapa para ver os dados.</p>
              )}
            </div>

            {/* State Year Comparison Chart - Renders if a state is selected */}
            {selectedState && !isLoadingData && (
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                <StateYearComparisonChart 
                  stateName={selectedStateNameForDisplay}
                  hotspots2020={hotspots2020ForSelectedState}
                  hotspots2021={hotspots2021ForSelectedState}
                  hotspots2022={hotspots2022ForSelectedState}
                  hotspots2023={hotspots2023ForSelectedState}
                  hotspots2024={hotspots2024ForSelectedState}
                />
              </div>
            )}

            {/* National Trend Line Chart */}
            {!isLoadingData && nationalTrendData.years.length > 0 && (
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                <NationalTrendLineChart trendData={nationalTrendData} isLoading={isLoadingData} />
              </div>
            )}

            {/* Monthly Hotspot Chart */}
            {!isLoadingData && currentFocosByMonth && (
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                 <MonthlyHotspotChart monthlyData={currentFocosByMonth} year={selectedYear} isLoading={isLoadingData} />
              </div>
            )}

            {/* Biome Doughnut Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-slate-700 mb-4">Focos por Bioma ({selectedYear})</h2>
              {isLoadingData && <p className="text-center text-slate-600">Carregando gráfico...</p>}
              {!isLoadingData && errorLoadingData && <p className="text-center text-red-500">Erro ao carregar dados.</p>}
              {!isLoadingData && !errorLoadingData && currentFocosDataByBiome ? (
                <BiomeDoughnutChart biomeData={currentFocosDataByBiome} />
              ) : (
                !isLoadingData && !errorLoadingData && <p className="text-center text-slate-500">Dados de bioma não disponíveis.</p>
              )}
            </div>

            {/* Top States Bar Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
              {/* Title is inside the chart component */}
              {isLoadingData && <p className="text-center text-slate-600">Carregando gráfico...</p>}
              {!isLoadingData && errorLoadingData && <p className="text-center text-red-500">Erro ao carregar dados.</p>}
              {!isLoadingData && !errorLoadingData && topStatesDataForChart.length > 0 ? (
                <TopStatesBarChart topStatesData={topStatesDataForChart} year={selectedYear} />
              ) : (
                !isLoadingData && !errorLoadingData && <p className="text-center text-slate-500">Não há dados de estados para exibir.</p>
              )}
            </div>

            </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

