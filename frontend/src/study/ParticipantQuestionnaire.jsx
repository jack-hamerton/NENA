import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Paper } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import studyService from '../services/studyService';
import { theme as styledTheme } from '../theme/theme';
import {
  QuestionnaireContainer,
  Title,
  Question,
  AnswerInput,
  SubmitButton,
} from './ParticipantQuestionnaire.styled';

const ParticipantQuestionnaireWrapper = ({ studyId, theme, user }) => {
  const [study, setStudy] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchStudy = async () => {
      if (!studyId) return;

      setLoading(true);
      try {
        const response = await studyService.getStudy(studyId);
        setStudy(response.data);
      } catch (error) {
        console.error('Error fetching study:', error);
        setError('Failed to load questionnaire');
      } finally {
        setLoading(false);
      }
    };

    fetchStudy();
  }, [studyId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (!user || !user.id) {
      setError('You must be logged in to submit answers');
      return;
    }

    try {
      await studyService.submitAnswers(studyId, answers, user.id);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting answers:', error);
      setError('Failed to submit answers. Please try again.');
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={styledTheme}>
        <QuestionnaireContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography>Loading questionnaire...</Typography>
          </Box>
        </QuestionnaireContainer>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={styledTheme}>
        <QuestionnaireContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column">
            <Typography color="error" variant="h6" gutterBottom>
              {error}
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Box>
        </QuestionnaireContainer>
      </ThemeProvider>
    );
  }

  if (submitted) {
    return (
      <ThemeProvider theme={styledTheme}>
        <QuestionnaireContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column">
            <Typography variant="h4" gutterBottom color="primary">
              Thank you for participating!
            </Typography>
            <Typography variant="body1">
              Your responses have been submitted successfully.
            </Typography>
          </Box>
        </QuestionnaireContainer>
      </ThemeProvider>
    );
  }

  if (!study) {
    return (
      <ThemeProvider theme={styledTheme}>
        <QuestionnaireContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography>Study not found</Typography>
          </Box>
        </QuestionnaireContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={styledTheme}>
      <QuestionnaireContainer>
        <Title>{study.title}</Title>
        <Typography variant="body1" gutterBottom>
          {study.description}
        </Typography>

        <Box component="form" sx={{ mt: 3 }}>
          {study.questions && study.questions.map((question, index) => (
            <Paper key={question.id} elevation={2} sx={{ p: 2, mb: 2 }}>
              <Question>
                {index + 1}. {question.text}
              </Question>
              <AnswerInput
                fullWidth
                multiline
                rows={3}
                placeholder="Enter your answer here..."
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Paper>
          ))}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <SubmitButton
              variant="contained"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length === 0}
            >
              Submit Answers
            </SubmitButton>
          </Box>
        </Box>
      </QuestionnaireContainer>
    </ThemeProvider>
  );
};

export default ParticipantQuestionnaireWrapper;