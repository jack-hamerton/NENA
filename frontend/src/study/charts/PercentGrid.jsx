
import React from 'react';
import CircularPercentCard from './CircularPercentCard';

interface PercentGridProps {
  items: {
    label: string;
    percentage: number;
    color: string;
  }[];
}

const PercentGrid: React.FC<PercentGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <CircularPercentCard key={index} {...item} />
      ))}
    </div>
  );
};

export default PercentGrid;
