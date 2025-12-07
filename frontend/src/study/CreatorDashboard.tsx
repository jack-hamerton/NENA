
import React, { useState } from 'react';
import QuestionInput from './charts/QuestionInput';
import AnswerCard from './charts/AnswerCard';
import DonutChart from './charts/DonutChart';
import RecommendationCard from './charts/RecommendationCard';
import CreatorQuestionBuilder from './CreatorQuestionBuilder';

const CreatorDashboard = () => {
  const [questions, setQuestions] = useState([]);

  const handleSaveQuestions = (newQuestions) => {
    setQuestions(newQuestions);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Creator Dashboard</h1>
      <CreatorQuestionBuilder onSave={handleSaveQuestions} />
      <div className="mt-4">
        <QuestionInput />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <AnswerCard
            percentage={68}
            sample={66}
            location="Kisumu Central & Muhoroni"
            topic="tax compliant"
          />
          <DonutChart
            data={{
              labels: ['Compliant', 'Non-compliant'],
              datasets: [
                {
                  data: [68, 32],
                  backgroundColor: ['#36A2EB', '#FF6384'],
                },
              ],
            }}
          />
          <RecommendationCard recommendation="Provide youth-friendly regulatory environment for financial institutions" />
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
