
import React from 'react';

const AnswerCard = ({ percentage, sample, location, topic }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-lg font-bold">{percentage}% of youth are {topic}</p>
      <p className="text-sm text-gray-600">(sample: {sample} youth, {location})</p>
    </div>
  );
};

export default AnswerCard;
