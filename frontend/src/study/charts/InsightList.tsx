
import React from 'react';

interface InsightListProps {
  insights: string[];
}

const InsightList: React.FC<InsightListProps> = ({ insights }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Key Learnings</h3>
      <ul className="list-disc list-inside">
        {insights.map((insight, index) => (
          <li key={index}>{insight}</li>
        ))}
      </ul>
    </div>
  );
};

export default InsightList;
