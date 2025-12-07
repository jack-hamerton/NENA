
import React from 'react';

const QuestionInput = ({ onQuestionChange, onFilterChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <input
        type="text"
        placeholder="What % of youth lack registration info?"
        className="w-full p-2 border rounded-lg"
        onChange={onQuestionChange}
      />
      <div className="flex justify-between mt-2">
        <select className="p-2 border rounded-lg" onChange={onFilterChange}>
          <option value="all">All Sub-counties</option>
          <option value="kisumu-central">Kisumu Central</option>
          <option value="muhoroni">Muhoroni</option>
        </select>
        <select className="p-2 border rounded-lg" onChange={onFilterChange}>
          <option value="all">All Topics</option>
          <option value="finance">Finance</option>
          <option value="registration">Registration</option>
          <option value="digitization">Digitization</option>
        </select>
        <select className="p-2 border rounded-lg" onChange={onFilterChange}>
          <option value="all">All Audiences</option>
          <option value="youth">Youth</option>
          <option value="policymakers">Policymakers</option>
          <option value="institutions">Institutions</option>
        </select>
      </div>
    </div>
  );
};

export default QuestionInput;
