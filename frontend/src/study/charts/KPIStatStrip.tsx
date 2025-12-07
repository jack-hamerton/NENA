
import React from 'react';

interface KPIStatStripProps {
  stats: {
    label: string;
    value: string;
  }[];
}

const KPIStatStrip: React.FC<KPIStatStripProps> = ({ stats }) => {
  return (
    <div className="flex justify-around p-4 bg-white rounded-lg shadow">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default KPIStatStrip;
