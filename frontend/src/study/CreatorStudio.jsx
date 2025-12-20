import React, { useState } from 'react';
import styled from 'styled-components';
import { FindingsPanel } from './FindingsPanel';
import { MethodologyPanel } from './MethodologyPanel';
import { BarChart } from './charts/BarChart';
import { DonutChart } from './charts/DonutChart';
import { KPIStatStrip } from './charts/KPIStatStrip';
import { QualTable } from './charts/QualTable';
import { InsightList } from './charts/InsightList';
import { QuoteCard } from './charts/QuoteCard';
import { RecommendationCard } from './charts/RecommendationCard';

const StudioContainer = styled.div`
  padding: 2rem;
  background-color: #f9f9f9;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${props => props.active ? '#fff' : 'transparent'};
  border-bottom: ${props => props.active ? '2px solid #007bff' : '2px solid transparent'};
  cursor: pointer;
  font-size: 16px;
`;

const ContentContainer = styled.div``;

const ChartGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
`;

const CreatorStudio = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for charts
  const barChartData = [
    { name: 'A', value: 400 },
    { name: 'B', value: 300 },
    { name: 'C', value: 200 },
    { name: 'D', value: 100 },
  ];

  const donutChartData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  const kpiData = [
      { title: 'Responses', value: '1,234' },
      { title: 'Completion Rate', value: '85%' },
      { title: 'Avg. Time', value: '5.6 min' },
  ];

  const qualTableData = {
      headers: ['Theme', 'Supporting Quotes'],
      rows: [
          ['Ease of Use', '"I found it very easy to navigate." - P1'],
          ['Feature Request', '"I wish there was a dark mode." - P2'],
      ]
  };

  const insights = ['Users prefer a simple interface', 'Mobile accessibility is a key concern'];
  const quote = { text: 'This is the best thing I have ever used!', author: 'Participant 4' };
  const recommendation = { title: 'Implement Dark Mode', description: 'A significant number of users requested a dark mode option to reduce eye strain.' };

  return (
    <StudioContainer>
      <TabContainer>
        <TabButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
          Dashboard
        </TabButton>
        <TabButton active={activeTab === 'findings'} onClick={() => setActiveTab('findings')}>
          Findings
        </TabButton>
        <TabButton active={activeTab === 'methodology'} onClick={() => setActiveTab('methodology')}>
          Methodology
        </TabButton>
      </TabContainer>

      <ContentContainer>
        {activeTab === 'dashboard' && (
            <ChartGrid>
                <BarChart data={barChartData} />
                <DonutChart data={donutChartData} />
                <KPIStatStrip stats={kpiData} />
                <QualTable data={qualTableData} />
                <InsightList insights={insights} />
                <QuoteCard quote={quote} />
                <RecommendationCard recommendation={recommendation} />
            </ChartGrid>
        )}
        {activeTab === 'findings' && <FindingsPanel />}
        {activeTab === 'methodology' && <MethodologyPanel />}
      </ContentContainer>
    </StudioContainer>
  );
};

export default CreatorStudio;
