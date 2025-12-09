/**
 * Category Chart Component
 * 
 * Bar chart showing requests by category for current month
 */

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
import type { CategoryChartData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryChartProps {
  data: CategoryChartData;
}

const CategoryChart = ({ data }: CategoryChartProps) => {
  const chartData = {
    labels: data.data.map((item) => item.categoryName),
    datasets: [
      {
        label: 'Requests',
        data: data.data.map((item) => item.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)', // blue
          'rgba(239, 68, 68, 0.6)', // red
          'rgba(245, 158, 11, 0.6)', // amber
          'rgba(16, 185, 129, 0.6)', // emerald
          'rgba(139, 92, 246, 0.6)', // violet
          'rgba(236, 72, 153, 0.6)', // pink
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context: any) => {
            return `${context.parsed.y} requests`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full" style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CategoryChart;

