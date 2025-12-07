
import React from 'react';

const QuoteCard = ({ quote, location, role }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-lg italic">"{quote}"</p>
      <p className="text-sm text-gray-600">- {role} in {location}</p>
    </div>
  );
};

export default QuoteCard;
