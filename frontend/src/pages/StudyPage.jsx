
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ThemeProvider } from 'styled-components';

import CreatorStudioWrapper from '../study/CreatorStudio';
import ParticipantQuestionnaireWrapper from '../study/ParticipantQuestionnaire';

const StudyPage = () => {
  const { studyId } = useParams();
  const location = useLocation();
  const theme = useTheme();
  const { user } = useAuth(); // Correctly accessing user

  const isCreatorStudio = location.pathname.startsWith('/study/new') || (studyId && !location.pathname.endsWith('/questionnaire'));
  const isQuestionnaire = location.pathname.endsWith('/questionnaire');

  if (isCreatorStudio) {
    return <CreatorStudioWrapper studyId={studyId} theme={theme} />;
  }

  if (isQuestionnaire) {
    return <ParticipantQuestionnaireWrapper studyId={studyId} theme={theme} user={user} />;
  }

  return <StudyDashboard theme={theme} />;
};

const StudyDashboard = ({ theme }) => {
  const [accessCode, setAccessCode] = useState('');
  const [userStudies, setUserStudies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStudies = async () => {
      try {
        const response = await studyService.getStudies();
        setUserStudies(response.data);
      } catch (error) {
        console.error('Error fetching user studies:', error);
      }
    };

    fetchUserStudies();
  }, []);

  const handleAccessSubmit = async (e) => {
    e.preventDefault();
    if (accessCode.trim()) {
      try {
        const response = await studyService.getStudyByCode(accessCode.trim());
        const study = response.data;
        navigate(`/study/${study.id}/questionnaire`);
      } catch (error) {
        console.error('Error finding study by code:', error);
        alert('Invalid access code. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ color: theme.palette.text.primary }}>
          Welcome to the Study Center
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 4, color: theme.palette.text.secondary }}>
          Create, manage, and participate in studies to gather insights and feedback.
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Grid item>
            <Button variant="contained" color="primary" size="large" component={Link} to="/study/new">
              Create New Study
            </Button>
          </Grid>
        </Grid>
        <Box component="form" onSubmit={handleAccessSubmit} sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ color: theme.palette.text.primary }}>
            Access a Study
          </Typography>
          <TextField
            fullWidth
            label="Enter 8-Digit Access Code"
            variant="outlined"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: theme.palette.primary.main },
                '&:hover fieldset': { borderColor: theme.palette.primary.dark },
                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.dark },
              },
              '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
              '& .MuiInputBase-input': { color: theme.palette.text.primary },
            }}
          />
          <Button type="submit" variant="contained" color="secondary" size="large" fullWidth>
            Start Questionnaire
          </Button>
        </Box>
        <Typography variant="h5" gutterBottom sx={{ mt: 6, color: theme.palette.text.primary }}>
          My Studies
        </Typography>
        <Grid container spacing={2}>
          {userStudies.map((study) => (
            <Grid item xs={12} sm={6} md={4} key={study.id}>
              <Paper elevation={2} sx={{ p: 2, backgroundColor: theme.palette.background.default }}>
                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>{study.title}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {study.participants ? study.participants.length : 0} Participants
                </Typography>
                <Button variant="text" color="secondary" component={Link} to={`/study/${study.id}`} sx={{ mt: 1 }}>
                  View Study
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default StudyPage;
