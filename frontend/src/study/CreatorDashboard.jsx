
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Import chart components
import KPIStatStrip from './charts/KPIStatStrip';
import QuoteCard from './charts/QuoteCard';
import InsightList from './charts/InsightList';
import DonutChart from '../components/DonutChart';
import BarChart from './charts/BarChart';
import WordCloud from './charts/WordCloud';
import { RecommendationCard } from './charts/RecommendationCard';
import { QualTable } from './charts/QualTable';

// Import panel components
import MethodologyPanel from './MethodologyPanel';

import {
  DashboardContainer,
  Header,
  Title,
  Subtitle,
  Section,
  ChartGrid,
  ChartCard,
} from './CreatorDashboard.styled';

const CreatorDashboard = () => {
  const { studyId } = useParams();
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    const id = studyId || 1;
    const ws = new WebSocket(`ws://localhost:8000/ws/study/${id}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAnalysisData(data);
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, [studyId]);

  // Mock data for components
  const kpiStats = [
    { label: 'Total Responses', value: '1,234' },
    { label: 'Completion Rate', value: '85%' },
    { label: 'Surveys Sent', value: '1,450' },
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
    description: 'Based on the analysis, a significant portion of the participants are in the 25-34 age group. To broaden the study's reach, consider targeting the 18-24 age group through social media campaigns.',
  };

  const qualData = {
    headers: ['Theme', 'Key Insight', 'Supporting Quote'],
    rows: [
      ['High initial setup costs', 'Founders are struggling with the initial capital required to start a business.', '“The biggest challenge is just getting started. The paperwork is overwhelming.”'],
      ['Complex regulatory procedures', 'Navigating the legal and regulatory landscape is a major hurdle.', '“High initial setup costs and complex regulatory procedures are significant barriers to entry for young entrepreneurs.”'],
    ],
  };

  const themes = analysisData?.themes ? analysisData.themes.map(theme => theme[0]) : [];
  const keyQuotes = analysisData?.key_quotes ? Object.entries(analysisData.key_quotes) : [];

  return (
    <DashboardContainer>
      <Header>
        <Title>Creator Dashboard</Title>
        <Subtitle>Live analysis of your study results.</Subtitle>
      </Header>
      
      <Section>
        <MethodologyPanel kiiCount={15} surveyCount={1234} />
      </Section>

      <Section>
        <KPIStatStrip stats={kpiStats} />
      </Section>

      <ChartGrid>
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
          <QualTable data={qualData} />
        </ChartCard>
        <ChartCard style={{ gridColumn: 'span 2' }}>
          {analysisData ? <WordCloud words={themes} title="Key Themes Word Cloud" /> : <p>Waiting for data...</p>}
        </ChartCard>
        <ChartCard style={{ gridColumn: 'span 1' }}>
          <h3 className="text-xl font-bold text-gray-800">Key Themes</h3>
          {analysisData ? <InsightList insights={themes} /> : <p>Waiting for data...</p>}
        </ChartCard>
        <ChartCard style={{ gridColumn: 'span 3' }}>
          <h3 className="text-xl font-bold text-gray-800">Key Quotes</h3>
          {analysisData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {keyQuotes.map(([theme, quote]) => (
                <QuoteCard key={theme} quote={quote} role={theme} location="Participant Response" />
              ))}
            </div>
          ) : (
            <p>Waiting for data...</p>
          )}
        </ChartCard>
      </ChartGrid>

    </DashboardContainer>
  );
};

export default CreatorDashboard;
