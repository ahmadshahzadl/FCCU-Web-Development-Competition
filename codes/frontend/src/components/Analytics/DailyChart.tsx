/**
 * Daily Chart Component
 * 
 * Line chart showing daily request trends for current month
 */

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { DailyChartData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DailyChartProps {
  data: DailyChartData;
}

const DailyChart = ({ data }: DailyChartProps) => {
  // Fill in missing dates with 0 count
  const startDate = new Date(data.data[0]?.date || new Date().toISOString().split('T')[0]);
  const endDate = new Date();
  
  const allDates: string[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    allDates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const dateMap = new Map(data.data.map((item) => [item.date, item.count]));
  const filledData = allDates.map((date) => ({
    date,
    count: dateMap.get(date) || 0,
  }));

  const chartData = {
    labels: filledData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Requests',
        data: filledData.map((item) => item.count),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
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
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="w-full" style={{ height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default DailyChart;

