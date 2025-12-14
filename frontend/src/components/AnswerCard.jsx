import React from 'react';

const AnswerCard = ({ question, answer }) => {
  return (
    <div className="answer-card">
      <h4>{question}</h4>
      <p>{answer}</p>
    </div>
  );
};

export default AnswerCard;
