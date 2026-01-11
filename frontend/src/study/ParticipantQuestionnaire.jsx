import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStudy } from '../services/studyService';
import { submitAnswers } from '../services/aiService';
import {
  QuestionnaireContainer,
  Title,
  Question,
  AnswerInput,
  SubmitButton
} from './ParticipantQuestionnaire.styled';

const ParticipantQuestionnaire = () => {
  const { studyId } = useParams();
  const [study, setStudy] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const studyData = await getStudy(studyId);
        setStudy(studyData);
      } catch (err) {
        setError('Failed to load study questions.');
      }
    };

    fetchStudy();
  }, [studyId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleSubmit = async () => {
    try {
      await submitAnswers(studyId, answers);
      // Redirect to a thank you page or show a success message
    } catch (err) {
      setError('Failed to submit answers.');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!study) {
    return <div>Loading...</div>;
  }

  return (
    <QuestionnaireContainer>
      <Title>{study.title}</Title>
      <p>{study.description}</p>
      {study.questions.map((question, index) => (
        <div key={index}>
          <Question>{question.text}</Question>
          <AnswerInput
            type="text"
            onChange={(e) => handleAnswerChange(index, e.target.value)}
          />
        </div>
      ))}
      <SubmitButton onClick={handleSubmit}>Submit Answers</SubmitButton>
    </QuestionnaireContainer>
  );
};

export default ParticipantQuestionnaire;
