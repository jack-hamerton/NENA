import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Grid, Paper } from '@mui/material';
import { ThemeProvider } from 'styled-components';
import { KPIStatStrip } from './charts/KPIStatStrip';
import { QuoteCard } from './charts/QuoteCard';
import { InsightList } from './charts/InsightList';
import DonutChart from '../components/DonutChart';
import BarChart from './charts/BarChart';
import WordCloud from './charts/WordCloud';
import { RecommendationCard } from './charts/RecommendationCard';
import { QualTable } from './charts/QualTable';
import MethodologyPanel from './MethodologyPanel';
import FindingsPanel from './findings/FindingsPanel';
import CreatorQuestionBuilder from './CreatorQuestionBuilder';
import studyService from '../services/studyService';
import { theme as styledTheme } from '../theme/theme';
import {
  StudioContainer,
  TabContainer,
  TabButton,
  ContentContainer,
  ChartGrid,
  ChartCard,
} from './CreatorStudio.styled';

const CreatorStudioWrapper = ({ studyId, theme }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudy = async () => {
      if (!studyId) return;

      setLoading(true);
      try {
        const response = await studyService.getStudy(studyId);
        setStudy(response.data);
      } catch (error) {
        console.error('Error fetching study:', error);
        setError('Failed to load study data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudy();
  }, [studyId]);

  if (loading) {
    return (
      <ThemeProvider theme={styledTheme}>
        <StudioContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography>Loading study...</Typography>
          </Box>
        </StudioContainer>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={styledTheme}>
        <StudioContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column">
            <Typography color="error" variant="h6" gutterBottom>
              {error}
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Box>
        </StudioContainer>
      </ThemeProvider>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'questions', label: 'Questions' },
    { id: 'responses', label: 'Responses' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'findings', label: 'Findings' },
  ];

  return (
    <ThemeProvider theme={styledTheme}>
      <StudioContainer>
        <Typography variant="h4" gutterBottom>
          Study Creator Studio
        </Typography>

        <TabContainer>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabContainer>

        <ContentContainer>
          {activeTab === 'overview' && (
            <Box>
              <Typography variant="h5" gutterBottom>Study Overview</Typography>
              {study && (
                <Box>
                  <Typography variant="h6">{study.title}</Typography>
                  <Typography variant="body1">{study.description}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access Code: {study.access_code}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {activeTab === 'questions' && (
            <Box>
              <Typography variant="h5" gutterBottom>Question Builder</Typography>
              <CreatorQuestionBuilder studyId={studyId} />
            </Box>
          )}

          {activeTab === 'responses' && (
            <Box>
              <Typography variant="h5" gutterBottom>Participant Responses</Typography>
              <QualTable studyId={studyId} />
            </Box>
          )}

          {activeTab === 'analysis' && (
            <Box>
              <Typography variant="h5" gutterBottom>Data Analysis</Typography>
              <ChartGrid>
                <ChartCard>
                  <KPIStatStrip studyId={studyId} />
                </ChartCard>
                <ChartCard>
                  <DonutChart data={[]} />
                </ChartCard>
                <ChartCard>
                  <BarChart data={[]} />
                </ChartCard>
                <ChartCard>
                  <WordCloud words={[]} />
                </ChartCard>
              </ChartGrid>
            </Box>
          )}

          {activeTab === 'findings' && (
            <Box>
              <Typography variant="h5" gutterBottom>Study Findings</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FindingsPanel studyId={studyId} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InsightList studyId={studyId} />
                  <RecommendationCard studyId={studyId} />
                </Grid>
              </Grid>
            </Box>
          )}
        </ContentContainer>
      </StudioContainer>
    </ThemeProvider>
  );
};

export default CreatorStudioWrapper;