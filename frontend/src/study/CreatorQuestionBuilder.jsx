
import React, { useState } from 'react';
import {
  BuilderContainer,
  Title,
  Label,
  Select,
  Input,
  Button,
  QuestionList,
  QuestionItem
} from './CreatorQuestionBuilder.styled';

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
    <BuilderContainer>
      <Title>Build Your Study</Title>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <Label htmlFor="methodology">Study Methodology</Label>
        <Select
          id="methodology"
          value={methodology}
          onChange={(e) => setMethodology(e.target.value as 'KII' | 'Survey')}
        >
          <option value="Survey">Survey</option>
          <option value="KII">Key Informant Interview (KII)</option>
        </Select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Label htmlFor="question">Question (up to 20)</Label>
        <div style={{ display: 'flex' }}>
          <Input
            id="question"
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Type your question here..."
            disabled={questions.length >= 20}
          />
          <Select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value as 'qualitative' | 'quantitative')}
            style={{ borderRadius: 0, width: 'auto' }}
          >
            <option value="quantitative">Quantitative</option>
            <option value="qualitative">Qualitative</option>
          </Select>
          <Button
            onClick={handleAddQuestion}
            disabled={questions.length >= 20 || !questionText.trim()}
          >
            Add
          </Button>
        </div>
        {questions.length >= 20 && <p style={{ color: 'red', marginTop: '0.5rem' }}>You have reached the maximum number of questions.</p>}
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Your Questions:</h4>
        <QuestionList>
          {questions.map((q, i) => (
            <QuestionItem key={i} type={q.type}>
              <span style={{ fontWeight: 'bold' }}>{q.text}</span> ({q.type})
            </QuestionItem>
          ))}
          {questions.length === 0 && <p>No questions added yet.</p>}
        </QuestionList>
      </div>
      
      <Button
        onClick={handleSave}
        disabled={questions.length === 0}
        style={{ width: '100%', borderRadius: '8px' }}
      >
        Save Study
      </Button>
    </BuilderContainer>
  );
};

export default CreatorQuestionBuilder;
