import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

// Definitive order for biomes to ensure consistent chart segments and legend
const DEFINED_BIOME_ORDER = [
  "Amazônia",
  "Cerrado",
  "Mata Atlântica",
  "Caatinga",
  "Pampa",
  "Pantanal"
];

// Updated color map for biomes, inspired by StateYearComparisonChart
const BIOME_COLOR_MAP = {
  "Amazônia": 'rgba(75, 192, 192, 0.7)',   // Teal-ish
  "Cerrado": 'rgba(54, 162, 235, 0.7)',    // Blue-ish
  "Mata Atlântica": 'rgba(255, 99, 132, 0.7)', // Red/Pink-ish
  "Caatinga": 'rgba(255, 159, 64, 0.7)',   // Orange
  "Pampa": 'rgba(153, 102, 255, 0.7)',    // Purple
  "Pantanal": 'rgba(255, 205, 86, 0.7)',   // Yellow
  // Fallback for any other biome not listed
  "Outro": 'rgba(161, 161, 170, 0.7)' // Zinc 400 with alpha
};

// Fallback color for biomes not in the map
const FALLBACK_BIOME_COLOR = '#d4d4d8'; // Tailwind zinc-300

const BiomeDoughnutChart = ({ biomeData }) => {
  if (!biomeData || Object.keys(biomeData).length === 0) {
    return <p className="text-center text-slate-500">Dados de bioma não disponíveis ou carregando...</p>;
  }

  // Prepare data in the defined order
  const chartLabels = [];
  const chartDataValues = [];

  DEFINED_BIOME_ORDER.forEach(biomeName => {
    if (biomeData.hasOwnProperty(biomeName)) {
      chartLabels.push(biomeName);
      chartDataValues.push(biomeData[biomeName]);
    }
  });

  // Add any biomes from data that were not in DEFINED_BIOME_ORDER (e.g., unexpected new biome)
  Object.keys(biomeData).forEach(biomeName => {
    if (!chartLabels.includes(biomeName)) {
      chartLabels.push(biomeName);
      chartDataValues.push(biomeData[biomeName]);
    }
  });

  const chartData = {
    labels: chartLabels, // Use ordered labels
    datasets: [
      {
        label: 'Focos por Bioma',
        data: chartDataValues, // Use ordered data values
        backgroundColor: chartLabels.map(label => BIOME_COLOR_MAP[label] || FALLBACK_BIOME_COLOR),
        borderColor: chartLabels.map(label => {
          const color = BIOME_COLOR_MAP[label] || FALLBACK_BIOME_COLOR;
          // Ensure the border is the same color but fully opaque
          if (color.startsWith('rgba')) {
            return color.replace(/,\s*[0-9.]+\)$/, ', 1)'); // Replace alpha with 1
          }
          return color; // Fallback for non-rgba colors (though current map is all rgba)
        }),
        borderWidth: 1.5, // Adjusted for a clean look
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for sizing in a flex/grid container
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#475569', // slate-600
          font: {
            size: 12,
            family: 'Figtree, sans-serif', // Ensure font matches
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: false, // We have a title in the card already
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { family: 'Figtree, sans-serif', size: 14 },
        bodyFont: { family: 'Figtree, sans-serif', size: 12 },
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed.toLocaleString('pt-BR');
            }
            const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1) + '%';
            return `${label} (${percentage})`;
          }
        }
      }
    },
    cutout: '60%', // Makes it a doughnut chart
  };

  return (
    <div style={{ height: '300px', width: '100%' }}> {/* Adjust height as needed */}
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default BiomeDoughnutChart; 