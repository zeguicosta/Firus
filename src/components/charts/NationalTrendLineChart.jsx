import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const NationalTrendLineChart = ({ trendData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-slate-500">Carregando tendência nacional...</p>
        <div className="h-48 mt-2 w-full bg-slate-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!trendData || trendData.years.length === 0) {
    return <p className="text-sm text-slate-500">Dados de tendência não disponíveis.</p>;
  }

  const data = {
    labels: trendData.years, // e.g., ['2022', '2023', '2024']
    datasets: [
      {
        label: 'Total de Focos no Brasil',
        data: trendData.totals, // e.g., [150000, 170000, 160000]
        fill: true,
        backgroundColor: 'rgba(5, 150, 105, 0.2)', // emerald-600 with alpha
        borderColor: '#059669', // emerald-600
        pointBackgroundColor: '#059669',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#059669',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false, // Start near the min value for better trend visibility
        ticks: {
          color: '#475569', // slate-600
          callback: function(value) {
            return value.toLocaleString('pt-BR');
          }
        },
        grid: {
          color: '#e2e8f0', // slate-200
        },
      },
      x: {
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
        display: false, // Label in dataset is clear enough
      },
      title: {
        display: true,
        text: 'Tendência Nacional de Focos de Queimadas (Anual)',
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
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString('pt-BR');
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="h-72 md:h-80 w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default NationalTrendLineChart; 