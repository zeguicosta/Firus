import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopStatesBarChart = ({ topStatesData, year }) => {
  if (!topStatesData || topStatesData.length === 0) {
    return <p className="text-sm text-slate-500">Não há dados de estados para exibir.</p>;
  }

  // Sort states by count descending and take top N (e.g., top 7)
  const sortedStates = [...topStatesData]
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);

  const data = {
    labels: sortedStates.map(s => s.stateName.charAt(0).toUpperCase() + s.stateName.slice(1).toLowerCase()),
    datasets: [
      {
        label: `Focos em ${year}`,
        data: sortedStates.map(s => s.count),
        backgroundColor: '#059669', // emerald-600
        borderColor: '#047857', // emerald-700
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Makes it a horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: '#475569', // slate-600
        },
        grid: {
          color: '#e2e8f0', // slate-200
        },
      },
      y: {
        ticks: {
          color: '#475569', // slate-600
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hiding legend as label is clear
      },
      title: {
        display: true,
        text: `Top Estados com Mais Focos em ${year}`,
        color: '#334155', // slate-700
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 16,
        }
      },
      tooltip: {
        backgroundColor: '#334155', // slate-700
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.x !== null) {
                    label += context.parsed.x.toLocaleString('pt-BR');
                }
                return label;
            }
        }
      }
    },
  };

  return (
    <div className="h-80 md:h-96 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

export default TopStatesBarChart; 