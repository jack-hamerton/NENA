
import React, { useState } from 'react';

const CreatorQuestionBuilder = ({ onSave }) => {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('quantitative');

  const handleAddQuestion = () => {
    if (questions.length < 20) {
      setQuestions([...questions, { text: questionText, type: questionType }]);
      setQuestionText('');
    }
  };

  const handleSave = () => {
    onSave(questions);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Questions</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question"
          className="w-full p-2 border rounded-lg"
        />
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="p-2 border rounded-lg ml-2"
        >
          <option value="quantitative">Quantitative</option>
          <option value="qualitative">Qualitative</option>
        </select>
        <button
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white p-2 rounded-lg ml-2"
        >
          Add Question
        </button>
      </div>
      <ul className="list-disc pl-5 mb-4">
        {questions.map((q, i) => (
          <li key={i}>
            {q.text} ({q.type})
          </li>
        ))}
      </ul>
      <button
        onClick={handleSave}
        className="bg-green-500 text-white p-2 rounded-lg"
      >
        Save Questions
      </button>
    </div>
  );
};

export default CreatorQuestionBuilder;
