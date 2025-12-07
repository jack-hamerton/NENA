
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CircularPercentCardProps {
  label: string;
  percentage: number;
  color: string;
}

const CircularPercentCard: React.FC<CircularPercentCardProps> = ({ label, percentage, color }) => {
  const data = {
    labels: [label, 'Remaining'],
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, '#e0e0e0'],
        hoverBackgroundColor: [color, '#e0e0e0'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow">
      <div style={{ width: '100px', height: '100px' }}>
        <Doughnut data={data} options={options} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
          {`${percentage}%`}
        </div>
      </div>
      <p className="mt-2 text-center text-gray-600">{label}</p>
    </div>
  );
};

export default CircularPercentCard;
