
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FindingsPanel } from './FindingsPanel';
import { MethodologyPanel } from './MethodologyPanel';
import { BarChart } from './charts/BarChart';
import { DonutChart } from './charts/DonutChart';
import { KPIStatStrip } from './charts/KPIStatStrip';
import { QualTable } from './charts/QualTable';
import { InsightList } from './charts/InsightList';
import { QuoteCard } from './charts/QuoteCard';
import { RecommendationCard } from './charts/RecommendationCard';
import {
  StudioContainer,
  TabContainer,
  TabButton,
  ContentContainer,
  ChartGrid
} from './CreatorStudio.styled';

const CreatorStudio = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [study, setStudy] = useState(null);
  const [answers, setAnswers] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        const studyResponse = await fetch(`http://localhost:8000/api/v1/studies/${id}`);
        if (studyResponse.ok) {
          const studyData = await studyResponse.json();
          setStudy(studyData);
        } else {
          console.error('Failed to fetch study data');
        }

        const answersResponse = await fetch(`http://localhost:8000/api/v1/studies/${id}/answers`);
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

    if (id) {
      fetchStudyData();
    }
  }, [id]);

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
      { title: 'Responses', value: answers.length },
      { title: 'Completion Rate', value: '-' },
      { title: 'Avg. Time', value: '-' },
  ];

  const qualTableData = {
      headers: ['Question', 'Answer'],
      rows: answers.map(answer => [answer.question.text, answer.text]),
  };

  const insights = ['No insights yet'];
  const quote = { text: 'No quotes yet', author: '' };
  const recommendation = { title: 'No recommendations yet', description: '' };

  if (answers.length > 0) {
      insights.pop();
      insights.push('The first insight is that users want more features.');

      quote.text = answers[0].text;
      quote.author = `Participant ${answers[0].id}`;

      recommendation.title = 'Add more features';
      recommendation.description = 'Users are asking for more features, so we should add them.';

  }

  if (!study) {
    return <div>Loading...</div>;
  }

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
        {activeTab === 'methodology' && <MethodologyPanel study={study} />}
      </ContentContainer>
    </StudioContainer>
  );
};

export default CreatorStudio;
