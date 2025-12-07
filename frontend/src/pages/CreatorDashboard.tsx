
import React from 'react';
import DonutChart from '../components/DonutChart';
import AnswerCard from '../components/AnswerCard';
import RecommendationCard from '../components/RecommendationCard';

const CreatorDashboard = () => {
  // Mock data for the study analysis
  const donutChartData = [{ name: 'Positive', value: 60 }, { name: 'Negative', value: 20 }, { name: 'Neutral', value: 20 }];
  const answerData = { question: 'What do you think of the new feature?', answer: 'I think it is great! It is very useful.' };
  const recommendationData = { recommendation: 'Consider adding a tutorial to help users understand the new feature.' };

  return (
    <div className="creator-dashboard">
      <h2>Creator Dashboard</h2>
      <div className="study-analysis">
        <DonutChart data={donutChartData} />
        <AnswerCard question={answerData.question} answer={answerData.answer} />
        <RecommendationCard recommendation={recommendationData.recommendation} />
      </div>
    </div>
  );
};

export default CreatorDashboard;
