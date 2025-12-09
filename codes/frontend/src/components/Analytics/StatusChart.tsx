/**
 * Status Chart Component
 * 
 * Pie chart showing requests by status for current month
 */

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { StatusChartData } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusChartProps {
  data: StatusChartData;
}

const StatusChart = ({ data }: StatusChartProps) => {
  const statusColors: Record<string, { bg: string; border: string }> = {
    pending: {
      bg: 'rgba(245, 158, 11, 0.6)', // amber
      border: 'rgba(245, 158, 11, 1)',
    },
    'in-progress': {
      bg: 'rgba(59, 130, 246, 0.6)', // blue
      border: 'rgba(59, 130, 246, 1)',
    },
    resolved: {
      bg: 'rgba(16, 185, 129, 0.6)', // emerald
      border: 'rgba(16, 185, 129, 1)',
    },
  };

  const chartData = {
    labels: data.data.map((item) => {
      const statusName = item.status
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return `${statusName} (${item.count})`;
    }),
    datasets: [
      {
        data: data.data.map((item) => item.count),
        backgroundColor: data.data.map(
          (item) => statusColors[item.status]?.bg || 'rgba(156, 163, 175, 0.6)'
        ),
        borderColor: data.data.map(
          (item) => statusColors[item.status]?.border || 'rgba(156, 163, 175, 1)'
        ),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
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
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full" style={{ height: '300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default StatusChart;

