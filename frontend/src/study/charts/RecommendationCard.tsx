
import React from 'react';

const RecommendationCard = ({ recommendation }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-lg font-bold">Recommendation</p>
      <p className="text-sm">{recommendation}</p>
    </div>
  );
};

export default RecommendationCard;
