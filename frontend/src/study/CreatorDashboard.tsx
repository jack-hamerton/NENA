
import React, { useState } from 'react';

// New chart components
import CircularPercentCard from './charts/CircularPercentCard';
import PercentGrid from './charts/PercentGrid';
import KPIStatStrip from './charts/KPIStatStrip';
import BarCompare from './charts/BarCompare';
import QuoteCard from './charts/QuoteCard';
import InsightList from './charts/InsightList';
import ChallengeBox from './charts/ChallengeBox';

// New panel components
import FindingsPanel from './FindingsPanel';
import MethodologyPanel from './MethodologyPanel';

// Existing components
import CreatorQuestionBuilder from './CreatorQuestionBuilder';

const CreatorDashboard: React.FC = () => {
  const [questions, setQuestions] = useState([]);

  const handleSaveQuestions = (newQuestions: any) => {
    setQuestions(newQuestions);
  };

  // Mock data for the new components
  const kpiStats = [
    { label: 'Total Responses', value: '1,234' },
    { label: 'Completion Rate', value: '85%' },
    { label: 'Surveys Sent', value: '1,450' },
  ];

  const percentGridItems = [
    { label: 'Tax Compliant', percentage: 36, color: '#36A2EB' },
    { label: 'Youth Owned', percentage: 62, color: '#FFCE56' },
    { label: 'Female Led', percentage: 48, color: '#FF6384' },
  ];

  const barCompareData = [
    { category: 'Kisumu Central', value: 450 },
    { category: 'Muhoroni', value: 320 },
    { category: 'Nyakach', value: 210 },
    { category: 'Seme', value: 150 },
  ];

  const insights = [
    'Youth-owned businesses struggle with access to capital.',
    'Regulatory hurdles are a major concern for new entrepreneurs.',
    'Digital marketing is the most effective channel for reaching customers.',
  ];

  const quote = {
    quote: "The biggest challenge is just getting started. The paperwork is overwhelming.",
    role: "Business Owner",
    location: "Kisumu",
  };

  const challenge = "High initial setup costs and complex regulatory procedures are significant barriers to entry for young entrepreneurs.";


  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-royal-blue-800">Creator Dashboard</h1>
        <p className="text-gray-600">Analyze your study results and gather insights.</p>
      </header>
      
      {/* Methodology Section */}
      <section className="mb-6">
        <MethodologyPanel kiiCount={15} surveyCount={1234} />
      </section>

      {/* KPI Strip */}
      <section className="mb-6">
        <KPIStatStrip stats={kpiStats} />
      </section>

      {/* Main Findings Section */}
      <FindingsPanel>
        {/* Quantitative Side */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Quantitative Analysis</h3>
          <PercentGrid items={percentGridItems} />
          <BarCompare data={barCompareData} maxValue={500} />
        </div>
        
        {/* Qualitative Side */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Qualitative Insights</h3>
          <QuoteCard {...quote} />
          <InsightList insights={insights} />
          <ChallengeBox challenge={challenge} />
        </div>
      </FindingsPanel>

      {/* Question Builder Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Study Question Builder</h2>
        <CreatorQuestionBuilder onSave={handleSaveQuestions} />
      </section>
    </div>
  );
};

export default CreatorDashboard;
