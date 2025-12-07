
import React from 'react';

interface AnswerCardProps {
  question: string;
  answer: string;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ question, answer }) => {
  return (
    <div className="answer-card">
      <h4>{question}</h4>
      <p>{answer}</p>
    </div>
  );
};

export default AnswerCard;
