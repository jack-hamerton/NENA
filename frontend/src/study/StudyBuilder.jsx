import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const StudyBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ text: '', type: 'text' }]);
  const [uniqueCode, setUniqueCode] = useState('');

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', type: 'text' }]);
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    const studyData = { title, description, questions };
    try {
      const response = await fetch('http://localhost:8000/api/v1/studies/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studyData),
      });
      if (response.ok) {
        const data = await response.json();
        setUniqueCode(data.unique_code);
        console.log('Study created successfully');
      } else {
        console.error('Failed to create study');
      }
    } catch (error) {
      console.error('Error creating study:', error);
    }
  };

  if (uniqueCode) {
    return (
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Study Created Successfully!
        </Typography>
        <Typography variant="body1">
          Share this unique code with participants to access the study:
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          {uniqueCode}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create a New Study
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Study Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Study Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={4}
        />
        {questions.map((question, index) => (
          <TextField
            key={index}
            fullWidth
            label={`Question ${index + 1}`}
            value={question.text}
            onChange={(e) => handleQuestionChange(index, e)}
            margin="normal"
          />
        ))}
        <Button variant="contained" onClick={handleAddQuestion} sx={{ mt: 2 }}>
          Add Question
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2, ml: 2 }}>
          Create Study
        </Button>
      </Box>
    </Paper>
  );
};

export default StudyBuilder;
