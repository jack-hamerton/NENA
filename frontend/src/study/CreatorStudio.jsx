
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

// Import chart components
import { KPIStatStrip } from './charts/KPIStatStrip';
import { QuoteCard } from './charts/QuoteCard';
import { InsightList } from './charts/InsightList';
import DonutChart from '../components/DonutChart';
import BarChart from './charts/BarChart';
import WordCloud from './charts/WordCloud';
import { RecommendationCard } from './charts/RecommendationCard';
import { QualTable } from './charts/QualTable';

// Import panel components
import MethodologyPanel from './MethodologyPanel';
import FindingsPanel from './findings/FindingsPanel';
import CreatorQuestionBuilder from './CreatorQuestionBuilder';
import { theme } from '../theme/theme';

import {
  StudioContainer,
  TabContainer,
  TabButton,
  ContentContainer,
  ChartGrid,
  ChartCard,
} from './CreatorStudio.styled';

const CreatorStudio = () => {
  const [activeTab, setActiveTab] = useState('build');
  const { studyId } = useParams();
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

      // Cleanup on component unmount
      return () => {
        ws.close();
      };
    }
  }, [studyId]);

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        const studyResponse = await fetch(`http://localhost:8000/api/v1/studies/${studyId}`);
        if (studyResponse.ok) {
          const studyData = await studyResponse.json();
          setStudy(studyData);
        } else {
          console.error('Failed to fetch study data');
        }

        const answersResponse = await fetch(`http://localhost:8000/api/v1/studies/${studyId}/answers`);
        if (answersResponse.ok) {
          const answersData = await answersResponse.json();
          setAnswers(answersData);
        } else {
          console.error('Failed to fetch answers data');
        }
      } catch (error) {
        console.error('Error fetching study data:', error);
      }
    };

    if (studyId) {
      fetchStudyData();
    }
  }, [studyId]);

  const handleSaveStudy = async (questions, methodology) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/studies/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions, methodology }),
      });

      if (response.ok) {
        const newStudy = await response.json();
        // Handle successful study creation, e.g., by redirecting to the new study's page
        console.log('Study created successfully:', newStudy);
        window.location.href = `/study/${newStudy.id}`;
      } else {
        console.error('Failed to save study');
      }
    } catch (error) {
      console.error('Error saving study:', error);
    }
  };

  // Mock data for components
  const kpiStats = [
    { title: 'Total Responses', value: answers.length },
    { title: 'Completion Rate', value: '85%' },
    { title: 'Surveys Sent', value: '1,450' },
  ];

  const sentimentData = analysisData?.sentiment
    ? [
        { name: 'Positive', value: analysisData.sentiment.positive },
        { name: 'Negative', value: analysisData.sentiment.negative },
        { name: 'Neutral', value: analysisData.sentiment.neutral },
      ]
    : [];

  const ageData = [
    { name: '18-24', value: 300 },
    { name: '25-34', value: 500 },
    { name: '35-44', value: 200 },
    { name: '45+', value: 150 },
  ];

  const recommendation = {
    title: 'Increase outreach to younger audiences',
    description: 'Based on the analysis, a significant portion of the participants are in the 25-34 age group. To broaden the study\'s reach, consider targeting the 18-24 age group through social media campaigns.',
  };

  const qualData = {
    headers: ['Question', 'Answer'],
    rows: answers.map(answer => [answer.question.text, answer.text]),
  };

  const themes = analysisData?.themes ? analysisData.themes.map(theme => theme[0]) : [];
  const keyQuotes = analysisData?.key_quotes ? Object.entries(analysisData.key_quotes) : [];

  return (
    <ThemeProvider theme={theme}>
      <StudioContainer>
        <TabContainer>
          <TabButton active={activeTab === 'build'} onClick={() => setActiveTab('build')}>
            Build
          </TabButton>
          <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} disabled={!studyId}>
            Dashboard
          </TabButton>
          <TabButton active={activeTab === 'findings'} onClick={() => setActiveTab('findings')} disabled={!studyId}>
            Findings
          </TabButton>
          <TabButton active={activeTab === 'methodology'} onClick={() => setActiveTab('methodology')} disabled={!studyId}>
            Methodology
          </TabButton>
        </TabContainer>

        <ContentContainer>
          {activeTab === 'build' && <CreatorQuestionBuilder onSave={handleSaveStudy} />}

          {activeTab === 'dashboard' && studyId && (
            <ChartGrid>
              <KPIStatStrip stats={kpiStats} />
              <ChartCard>
                {analysisData ? <DonutChart data={sentimentData} title="Sentiment Analysis" /> : <p>Waiting for data...</p>}
              </ChartCard>
              <ChartCard>
                <BarChart data={ageData} title="Participant Age Distribution" />
              </ChartCard>
              <ChartCard>
                <RecommendationCard recommendation={recommendation} />
              </ChartCard>
              <ChartCard style={{ gridColumn: 'span 3' }}>
                <QualTable data={qualData} title="Qualitative Data" />
              </ChartCard>
              <ChartCard style={{ gridColumn: 'span 2' }}>
                {analysisData ? <WordCloud words={themes} title="Key Themes Word Cloud" /> : <p>Waiting for data...</p>}
              </ChartCard>
              <ChartCard style={{ gridColumn: 'span 1' }}>
                {analysisData ? <InsightList insights={themes} title="Key Themes" /> : <p>Waiting for data...</p>}
              </ChartCard>
              <ChartCard style={{ gridColumn: 'span 3' }}>
                <h3 className="text-xl font-bold text-gray-800">Key Quotes</h3>
                {analysisData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {keyQuotes.map(([theme, quote]) => (
                      <QuoteCard key={theme} quote={{ text: quote, author: theme }} />
                    ))}
                  </div>
                ) : (
                  <p>Waiting for data...</p>
                )}
              </ChartCard>
            </ChartGrid>
          )}

          {activeTab === 'findings' && studyId && <FindingsPanel />}

          {activeTab === 'methodology' && studyId && <MethodologyPanel study={study} />}

        </ContentContainer>
      </StudioContainer>
    </ThemeProvider>
  );
};

export default CreatorStudio;
