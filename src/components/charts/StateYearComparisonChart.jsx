import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StateYearComparisonChart = ({ stateName, hotspots2020, hotspots2021, hotspots2022, hotspots2023, hotspots2024 }) => {
  const data = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: `Focos de Incêndio em ${stateName}`,
        data: [hotspots2020, hotspots2021, hotspots2022, hotspots2023, hotspots2024],
        backgroundColor: [
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#475569',
          font: {
            size: 12,
            family: 'Figtree, sans-serif',
          },
        }
      },
      title: {
        display: true,
        text: `Comparativo Anual de Focos: ${stateName}`,
        color: '#334155',
        font: {
          size: 16,
          family: 'Figtree, sans-serif',
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: { family: 'Figtree, sans-serif', size: 14 },
        bodyFont: { family: 'Figtree, sans-serif', size: 12 },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label.startsWith('Focos de Incêndio em')) {
                label = context.label || '';
            }
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
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nº de Focos',
          color: '#475569',
          font: {
            size: 12,
            family: 'Figtree, sans-serif',
            weight: 'semibold'
          }
        },
        ticks: {
          color: '#475569'
        },
        grid: {
          color: '#e2e8f0'
        }
      },
      x: {
        ticks: {
          color: '#475569'
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ height: '350px', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StateYearComparisonChart; 