
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, Container } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DonutChart from '../components/DonutChart';
import AnswerCard from '../components/AnswerCard';
import RecommendationCard from '../components/RecommendationCard';
import { theme } from '../theme/theme';
import studyService from '../services/studyService';

// Main component that orchestrates the study functionality
const StudyPage = () => {
  const { id } = useParams();
  const [view, setView] = useState('list'); // 'list', 'create', 'participate', 'dashboard', 'gate'
  const [selectedStudyId, setSelectedStudyId] = useState(null);
  const [creatorStudyId, setCreatorStudyId] = useState(null);

  useEffect(() => {
    if (id) {
      setSelectedStudyId(id);
      setView('gate');
    }
  }, [id]);

  const renderView = () => {
    switch (view) {
      case 'create':
        return <StudyBuilder setView={setView} setCreatorStudyId={setCreatorStudyId} />;
      case 'gate':
        return <ParticipantGate studyId={selectedStudyId} setView={setView} />
      case 'participate':
        return <StudyParticipantView studyId={selectedStudyId} />;
      case 'dashboard':
        return <CreatorDashboard studyId={creatorStudyId} />;
      case 'list':
      default:
        return <StudySearch setView={setView} setSelectedStudyId={setSelectedStudyId} />;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, color: theme.text.primary }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Study Page
      </Typography>
      {renderView()}
    </Container>
  );
};

const StudySearch = ({ setView, setSelectedStudyId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await studyService.searchStudies(query);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching for studies:', error);
    }
  };

  const handleSelectStudy = (studyId) => {
    setSelectedStudyId(studyId);
    navigate(`/study/${studyId}`);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: theme.palette.primary }}>
        <Button variant="contained" onClick={() => setView('create')} sx={{ mb: 2, backgroundColor: theme.palette.accent }}>
          Create New Study
        </Button>
      <TextField
        fullWidth
        label="Search for a study"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        margin="normal"
        sx={{ input: { color: theme.text.primary }, label: { color: theme.text.secondary } }}
      />
      <Button variant="contained" onClick={handleSearch} sx={{ mt: 2, backgroundColor: theme.palette.accent }}>
        Search
      </Button>
      <Box mt={4}>
        {results.map((study) => (
          <Box key={study.id} sx={{ mb: 2, p: 2, border: `1px solid ${theme.palette.secondary}`, borderRadius: '4px', cursor: 'pointer' }} onClick={() => handleSelectStudy(study.id)}>
            <Typography variant="h6" sx={{ color: theme.palette.tertiary }}>{study.title}</Typography>
            <Typography>{study.description}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

const ParticipantGate = ({ studyId, setView }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      await studyService.verifyStudyAccess(studyId, code);
      setView('participate');
    } catch (error) {
      setError('Invalid code. Please try again.');
      console.error('Error verifying study access:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: theme.palette.primary }}>
      <Typography variant="h5" gutterBottom>
        Access Study
      </Typography>
      <TextField
        fullWidth
        label="Enter 8-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        margin="normal"
        sx={{ input: { color: theme.text.primary }, label: { color: theme.text.secondary } }}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" onClick={handleVerify} sx={{ mt: 2, backgroundColor: theme.palette.accent }}>
        Enter
      </Button>
    </Paper>
  );
}

// Component for creating a new study
const StudyBuilder = ({ setView, setCreatorStudyId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ text: '', type: 'text' }]);
  const [study, setStudy] = useState(null);

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
      const response = await studyService.createStudy(studyData);
      setStudy(response.data);
      setCreatorStudyId(response.data.id);
    } catch (error) {
      console.error('Error creating study:', error);
    }
  };

  if (study) {
    return (
      <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: theme.palette.primary }}>
        <Typography variant="h5" gutterBottom>
          Study Created Successfully!
        </Typography>
        <Typography variant="body1">
          Share this unique code with participants to access the study:
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 2, color: theme.palette.tertiary }}>
          {study.unique_code}
        </Typography>
        <Button variant="contained" onClick={() => setView('dashboard')} sx={{ mt: 2, backgroundColor: theme.palette.accent }}>
          View Dashboard
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: theme.palette.primary }}>
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
          sx={{ input: { color: theme.text.primary }, label: { color: theme.text.secondary } }}
        />
        <TextField
          fullWidth
          label="Study Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={4}
          sx={{ textarea: { color: theme.text.primary }, label: { color: theme.text.secondary } }}
        />
        {questions.map((question, index) => (
          <TextField
            key={index}
            fullWidth
            label={`Question ${index + 1}`}
            value={question.text}
            onChange={(e) => handleQuestionChange(index, e)}
            margin="normal"
            sx={{ input: { color: theme.text.primary }, label: { color: theme.text.secondary } }}
          />
        ))}
        <Button variant="contained" onClick={handleAddQuestion} sx={{ mt: 2, backgroundColor: theme.palette.accent }}>
          Add Question
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2, ml: 2, backgroundColor: theme.palette.accent }}>
          Create Study
        </Button>
      </Box>
    </Paper>
  );
};

// Component for participating in a study
const StudyParticipantView = ({ studyId }) => {
  const [study, setStudy] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const response = await studyService.getStudy(studyId);
        setStudy(response.data);
      } catch (error) {
        console.error('Error fetching study:', error);
      }
    };

    fetchStudy();
  }, [studyId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    try {
      await studyService.submitAnswers(studyId, Object.values(answers));
      // Optionally, redirect to a thank you page
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  if (!study) {
    return <div>Loading...</div>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: theme.palette.primary }}>
      <Typography variant="h5" gutterBottom>
        {study.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        {study.description}
      </Typography>
      {study.questions.map((question) => (
        <Box key={question.id} sx={{ mb: 2 }}>
          <Typography variant="h6">{question.text}</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            margin="normal"
            sx={{ textarea: { color: theme.text.primary }, label: { color: theme.text.secondary } }}
          />
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2, backgroundColor: theme.palette.accent }}>
        Submit Answers
      </Button>
    </paper>
  );
};

// Component for the creator's dashboard
const CreatorDashboard = ({ studyId }) => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await studyService.getStudyResults(studyId);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching study results:', error);
      }
    };

    fetchResults();
  }, [studyId]);

  if (!results) {
    return <div>Loading...</div>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, backgroundColor: theme.palette.primary }}>
      <Typography variant="h5" gutterBottom>
        Creator Dashboard
      </Typography>
      <div className="study-analysis">
        <DonutChart data={results.donutChartData} />
        <AnswerCard question={results.answerData.question} answer={results.answerData.answer} />
        <RecommendationCard recommendation={results.recommendationData.recommendation} />
      </div>
    </Paper>
  );
};

export default StudyPage;
