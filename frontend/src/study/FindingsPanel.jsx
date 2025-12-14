
import React from 'react';

const FindingsPanel = ({ children }) => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold mb-4">Findings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{children}</div>
    </div>
  );
};

export default FindingsPanel;
