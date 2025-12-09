import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

const StudyParticipantView = () => {
  const { uniqueCode } = useParams();
  const [study, setStudy] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const fetchStudyByCode = async (code) => {
    if (!code) return;
    try {
      const response = await fetch(`http://localhost:8000/api/v1/studies/code/${code}`);
      if (response.ok) {
        const data = await response.json();
        setStudy(data);
        setAnswers(new Array(data.questions.length).fill(''));
        setError('');
      } else {
        setError('Study not found or invalid access code.');
        setStudy(null);
      }
    } catch (err) {
      setError('An error occurred while fetching the study.');
      setStudy(null);
    }
  };

  useEffect(() => {
    if (uniqueCode) {
      setAccessCode(uniqueCode);
      fetchStudyByCode(uniqueCode);
    }
  }, [uniqueCode]);

  const handleFetchStudy = () => {
    if (accessCode) {
      fetchStudyByCode(accessCode);
    } else {
      setError('Please enter an access code.');
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmitAnswers = async () => {
    const responseData = {
      study_id: study.id,
      answers: study.questions.map((question, index) => ({
        question_id: question.id,
        answer_text: answers[index],
      })),
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/responses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      });

      if (response.ok) {
        setSubmitted(true);
        console.log('Answers submitted successfully');
      } else {
        console.error('Failed to submit answers');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  if (submitted) {
    return (
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Thank You!
        </Typography>
        <Typography variant="body1">
          Your answers have been submitted successfully.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      {!study ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            Access a Study
          </Typography>
          <TextField
            fullWidth
            label="Enter Access Code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            margin="normal"
            error={!!error}
            helperText={error}
          />
          <Button variant="contained" color="primary" onClick={handleFetchStudy} sx={{ mt: 2 }}>
            Access Study
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom>{study.title}</Typography>
          <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>{study.description}</Typography>
          {study.questions.map((question, index) => (
            <TextField
              key={question.id}
              fullWidth
              label={question.text}
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              margin="normal"
              multiline
              rows={2}
            />
          ))}
          <Button variant="contained" color="primary" onClick={handleSubmitAnswers} sx={{ mt: 3 }}>
            Submit Answers
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default StudyParticipantView;
