
import React from 'react';

interface ChallengeBoxProps {
  challenge: string;
}

const ChallengeBox: React.FC<ChallengeBoxProps> = ({ challenge }) => {
  return (
    <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
      <p className="font-bold">Challenge</p>
      <p>{challenge}</p>
    </div>
  );
};

export default ChallengeBox;
