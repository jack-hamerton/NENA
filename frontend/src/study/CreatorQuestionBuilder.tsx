
import React, { useState } from 'react';

interface Question {
  text: string;
  type: 'qualitative' | 'quantitative';
}

interface CreatorQuestionBuilderProps {
  onSave: (questions: Question[], methodology: 'KII' | 'Survey') => void;
}

const CreatorQuestionBuilder: React.FC<CreatorQuestionBuilderProps> = ({ onSave }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'qualitative' | 'quantitative'>('quantitative');
  const [methodology, setMethodology] = useState<'KII' | 'Survey'>('Survey');

  const handleAddQuestion = () => {
    if (questionText.trim() && questions.length < 20) {
      setQuestions([...questions, { text: questionText, type: questionType }]);
      setQuestionText('');
    }
  };

  const handleSave = () => {
    onSave(questions, methodology);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Build Your Study</h3>
      
      {/* Methodology Selection */}
      <div className="mb-4">
        <label htmlFor="methodology" className="block text-gray-700 font-bold mb-2">Study Methodology</label>
        <select
          id="methodology"
          value={methodology}
          onChange={(e) => setMethodology(e.target.value as 'KII' | 'Survey')}
          className="w-full p-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-royal-blue-500"
        >
          <option value="Survey">Survey</option>
          <option value="KII">Key Informant Interview (KII)</option>
        </select>
      </div>

      {/* Question Input */}
      <div className="mb-4">
        <label htmlFor="question" className="block text-gray-700 font-bold mb-2">Question (up to 20)</label>
        <div className="flex">
          <input
            id="question"
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your question here..."
            className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-royal-blue-500"
            disabled={questions.length >= 20}
          />
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value as 'qualitative' | 'quantitative')}
            className="p-2 border-t border-b bg-gray-50 focus:outline-none focus:ring-2 focus:ring-royal-blue-500"
          >
            <option value="quantitative">Quantitative</option>
            <option value="qualitative">Qualitative</option>
          </select>
          <button
            onClick={handleAddQuestion}
            className="bg-royal-blue-500 text-white p-2 rounded-r-lg hover:bg-royal-blue-600 disabled:bg-gray-400"
            disabled={questions.length >= 20 || !questionText.trim()}
          >
            Add
          </button>
        </div>
        {questions.length >= 20 && <p className="text-sm text-red-500 mt-1">You have reached the maximum number of questions.</p>}
      </div>
      
      {/* Question List */}
      <div className="mb-4">
        <h4 className="font-bold mb-2">Your Questions:</h4>
        <ul className="list-decimal list-inside bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
          {questions.map((q, i) => (
            <li key={i} className={`mb-1 p-1 rounded ${q.type === 'quantitative' ? 'bg-blue-100' : 'bg-green-100'}`}>
              <span className="font-semibold">{q.text}</span> ({q.type})
            </li>
          ))}
          {questions.length === 0 && <p className="text-gray-500">No questions added yet.</p>}
        </ul>
      </div>
      
      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
        disabled={questions.length === 0}
      >
        Save Study
      </button>
    </div>
  );
};

export default CreatorQuestionBuilder;
