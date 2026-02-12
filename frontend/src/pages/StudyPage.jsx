
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

import { KPIStatStrip } from '../study/charts/KPIStatStrip';
import { QuoteCard } from '../study/charts/QuoteCard';
import { InsightList } from '../study/charts/InsightList';
import DonutChart from '../components/DonutChart';
import BarChart from '../study/charts/BarChart';
import WordCloud from '../study/charts/WordCloud';
import { RecommendationCard } from '../study/charts/RecommendationCard';
import { QualTable } from '../study/charts/QualTable';
import MethodologyPanel from '../study/MethodologyPanel';
import FindingsPanel from '../study/findings/FindingsPanel';
import CreatorQuestionBuilder from '../study/CreatorQuestionBuilder';
import studyService from '../services/studyService';
import { useAuth } from '../contexts/AuthContext';
import { theme as styledTheme } from '../theme/theme';
import {
  StudioContainer,
  TabContainer,
  TabButton,
  ContentContainer as CreatorContentContainer,
  ChartGrid,
  ChartCard,
} from '../study/CreatorStudio.styled';
import {
  QuestionnaireContainer,
  Title as QuestionnaireTitle,
  Question as QuestionnaireQuestion,
  AnswerInput,
  SubmitButton as QuestionnaireSubmitButton,
} from '../study/ParticipantQuestionnaire.styled';

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
    // Pass the user to the questionnaire
    return <ParticipantQuestionnaireWrapper studyId={studyId} theme={theme} user={user} />;
  }

  return <StudyDashboard theme={theme} />;
};

const StudyDashboard = ({ theme }) => {
  const [studyId, setStudyId] = useState('');
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

  const handleAccessSubmit = (e) => {
    e.preventDefault();
    if (studyId.trim()) {
      navigate(`/study/${studyId}/questionnaire`);
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
            label="Study ID"
            variant="outlined"
            value={studyId}
            onChange={(e) => setStudyId(e.target.value)}
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

const CreatorStudioWrapper = ({ studyId }) => {
  const [activeTab, setActiveTab] = useState('build');
  const [analysisData, setAnalysisData] = useState(null);
  const [study, setStudy] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (studyId) {
      const ws = new WebSocket(`ws://localhost:8000/ws/study/${studyId}`);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setAnalysisData(data);
      };
      return () => ws.close();
    }
  }, [studyId]);

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        if (studyId) {
          const studyResponse = await studyService.getStudy(studyId);
          setStudy(studyResponse.data);

          const answersResponse = await studyService.getStudyAnswers(studyId);
          setAnswers(answersResponse.data);
        }
      } catch (error) {
        console.error('Error fetching study data:', error);
      }
    };
    fetchStudyData();
  }, [studyId]);

  const handleSaveStudy = async (studyData) => {
    try {
      const response = await studyService.createStudy(studyData);
      const newStudy = response.data;
      window.location.href = `/study/${newStudy.id}`;
    } catch (error) {
      console.error('Error saving study:', error);
    }
  };

  const kpiStats = [{ title: 'Total Responses', value: answers.length }, { title: 'Completion Rate', value: '85%' }, { title: 'Surveys Sent', value: '1,450' }];
  const sentimentData = analysisData?.sentiment ? [ { name: 'Positive', value: analysisData.sentiment.positive }, { name: 'Negative', value: analysisData.sentiment.negative }, { name: 'Neutral', value: analysisData.sentiment.neutral } ] : [];
  const ageData = [{ name: '18-24', value: 300 }, { name: '25-34', value: 500 }, { name: '35-44', value: 200 }, { name: '45+', value: 150 }];
  const recommendation = { title: 'Increase outreach to younger audiences', description: 'Based on the analysis, a significant portion of the participants are in the 25-34 age group. To broaden the study\'s reach, consider targeting the 18-24 age group through social media campaigns.' };
  const qualData = { headers: ['Question', 'Answer'], rows: answers.map(answer => [answer.question.text, answer.text]) };
  const themes = analysisData?.themes ? analysisData.themes.map(theme => theme[0]) : [];
  const keyQuotes = analysisData?.key_quotes ? Object.entries(analysisData.key_quotes) : [];

  return (
    <ThemeProvider theme={styledTheme}>
      <StudioContainer>
        <TabContainer>
          <TabButton active={activeTab === 'build'} onClick={() => setActiveTab('build')}>Build</TabButton>
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} disabled={!studyId}>Dashboard</TabButton>
          <TabButton active={activeTab === 'findings'} onClick={() => setActiveTab('findings')} disabled={!studyId}>Findings</TabButton>
          <TabButton active={activeTab === 'methodology'} onClick={() => setActiveTab('methodology')} disabled={!studyId}>Methodology</TabButton>
        </TabContainer>
        <CreatorContentContainer>
          {activeTab === 'build' && <CreatorQuestionBuilder onSave={handleSaveStudy} />}
          {activeTab === 'dashboard' && studyId && (
            <ChartGrid>
              <KPIStatStrip stats={kpiStats} />
              <ChartCard>{analysisData ? <DonutChart data={sentimentData} title="Sentiment Analysis" /> : <p>Waiting for data...</p>}</ChartCard>
              <ChartCard><BarChart data={ageData} title="Participant Age Distribution" /></ChartCard>
              <ChartCard><RecommendationCard recommendation={recommendation} /></ChartCard>
              <ChartCard style={{ gridColumn: 'span 3' }}><QualTable data={qualData} title="Qualitative Data" /></ChartCard>
              <ChartCard style={{ gridColumn: 'span 2' }}>{analysisData ? <WordCloud words={themes} title="Key Themes Word Cloud" /> : <p>Waiting for data...</p>}</ChartCard>
              <ChartCard style={{ gridColumn: 'span 1' }}>{analysisData ? <InsightList insights={themes} title="Key Themes" /> : <p>Waiting for data...</p>}</ChartCard>
              <ChartCard style={{ gridColumn: 'span 3' }}>
                <h3 className="text-xl font-bold text-gray-800">Key Quotes</h3>
                {analysisData ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{keyQuotes.map(([theme, quote]) => (<QuoteCard key={theme} quote={{ text: quote, author: theme }} />))}</div> : <p>Waiting for data...</p>}
              </ChartCard>
            </ChartGrid>
          )}
          {activeTab === 'findings' && studyId && <FindingsPanel />}
          {activeTab === 'methodology' && studyId && <MethodologyPanel study={study} />}
        </CreatorContentContainer>
      </StudioContainer>
    </ThemeProvider>
  );
};

const ParticipantQuestionnaireWrapper = ({ studyId, user }) => {
  const [study, setStudy] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudy = async () => {
      try {
        const response = await studyService.getStudy(studyId);
        setStudy(response.data);
      } catch (err) {
        setError('Failed to load study questions.');
      }
    };
    fetchStudy();
  }, [studyId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    try {
      await studyService.submitAnswers(studyId, answers, user.id);
      navigate('/home'); // Redirect to home on success
    } catch (err) {
      setError('Failed to submit answers.');
    }
  };

  if (error) return <div>{error}</div>;
  if (!study) return <div>Loading...</div>;

  return (
    <QuestionnaireContainer>
      <QuestionnaireTitle>{study.title}</QuestionnaireTitle>
      <p>{study.description}</p>
      {study.questions.map((question) => (
        <div key={question.id}>
          <QuestionnaireQuestion>{question.text}</QuestionnaireQuestion>
          <AnswerInput type="text" onChange={(e) => handleAnswerChange(question.id, e.target.value)} />
        </div>
      ))}
      <QuestionnaireSubmitButton onClick={handleSubmit}>Submit Answers</QuestionnaireSubmitButton>
    </QuestionnaireContainer>
  );
};

export default StudyPage;
