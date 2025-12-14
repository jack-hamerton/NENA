
import React from 'react';

interface RecommendationCardProps {
  recommendation: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  return (
    <div className="recommendation-card">
      <h4>Recommendation</h4>
      <p>{recommendation}</p>
    </div>
  );
};

export default RecommendationCard;
