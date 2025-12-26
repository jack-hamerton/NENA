
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Import existing chart components
import KPIStatStrip from './charts/KPIStatStrip';
import QuoteCard from './charts/QuoteCard';
import InsightList from './charts/InsightList';
import DonutChart from '../components/DonutChart'; // Assuming DonutChart is in components

// Import existing panel components
import FindingsPanel from './FindingsPanel';
import MethodologyPanel from './MethodologyPanel';

import {
  DashboardContainer,
  Header,
  Title,
  Subtitle,
  Section,
} from './CreatorDashboard.styled';

const CreatorDashboard = () => {
  // Assuming the study ID is in the URL, e.g., /study/1/dashboard
  const { studyId } = useParams();
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    // Default to studyId 1 if not available in URL for simulation
    const id = studyId || 1; 
    
    // Establish WebSocket connection
    const ws = new WebSocket(`ws://localhost:8000/ws/study/${id}`);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received analysis data:', data);
      setAnalysisData(data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, [studyId]);

  // Mock data for components not yet connected to the real-time feed
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

      <FindingsPanel>
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Real-time Sentiment</h3>
          {analysisData ? <DonutChart data={sentimentData} /> : <p>Waiting for data...</p>}
        </div>
        
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Key Themes</h3>
          {analysisData ? <InsightList insights={themes} /> : <p>Waiting for data...</p>}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Key Quotes</h3>
          {analysisData ? (
            keyQuotes.map(([theme, quote]) => (
              <QuoteCard key={theme} quote={quote} role={theme} location="Participant Response" />
            ))
          ) : (
            <p>Waiting for data...</p>
          )}
        </div>
      </FindingsPanel>

    </DashboardContainer>
  );
};

export default CreatorDashboard;
