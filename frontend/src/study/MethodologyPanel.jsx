
import React from 'react';

interface MethodologyPanelProps {
  kiiCount: number;
  surveyCount: number;
}

const MethodologyPanel: React.FC<MethodologyPanelProps> = ({ kiiCount, surveyCount }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h3 className="text-lg font-bold mb-2">Methodology</h3>
      <p>Key Informant Interviews (KIIs): {kiiCount}</p>
      <p>Surveys: {surveyCount}</p>
    </div>
  );
};

export default MethodologyPanel;
