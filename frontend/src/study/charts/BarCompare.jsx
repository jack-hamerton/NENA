
import React from 'react';

interface BarCompareProps {
  data: {
    category: string;
    value: number;
  }[];
  maxValue: number;
}

const BarCompare: React.FC<BarCompareProps> = ({ data, maxValue }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {data.map((item, index) => (
        <div key={index} className="flex items-center mb-2">
          <p className="w-1/4 text-gray-600">{item.category}</p>
          <div className="w-3/4 bg-gray-200 rounded-full">
            <div
              className="bg-royal-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            >
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarCompare;
