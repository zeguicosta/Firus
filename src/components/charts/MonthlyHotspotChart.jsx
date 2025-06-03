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

const MONTH_LABELS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const MonthlyHotspotChart = ({ monthlyData, year, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-4 rounded-lg shadow-md text-center">
        <p className="text-sm text-slate-500">Carregando dados mensais...</p>
        <div className="h-48 mt-2 w-full bg-slate-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!monthlyData || monthlyData.length !== 12) {
    return <p className="text-sm text-slate-500">Dados mensais não disponíveis para {year}. Verifique se a coluna 'data_pas' está presente e correta no CSV.</p>;
  }

  const data = {
    labels: MONTH_LABELS,
    datasets: [
      {
        label: `Focos por Mês em ${year}`,
        data: monthlyData,
        backgroundColor: 'rgba(22, 163, 74, 0.6)', // emerald-500 with alpha
        borderColor: '#16A34A', // emerald-500
        borderWidth: 1,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#475569', // slate-600
          callback: function(value) {
            if (value % 1 === 0) { // Show only whole numbers for counts
              return value.toLocaleString('pt-BR');
            }
          },
        },
        grid: {
          color: '#e2e8f0', // slate-200
        },
        title: {
          display: true,
          text: 'Nº de Focos',
          color: '#475569',
          font: {
            size: 12,
            weight: 'semibold'
          }
        }
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
        display: false,
      },
      title: {
        display: true,
        text: `Distribuição Mensal de Focos de Queimadas em ${year}`,
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
              label = `Focos em ${context.label}, ${year}: `;
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
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyHotspotChart; 