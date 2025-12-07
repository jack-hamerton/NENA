import React, { useState, useEffect } from 'react';
import './Reactions.css';

interface Reaction {
  id: string;
  emoji: string;
  participantId: string;
}

interface ReactionsProps {
  reactions: Reaction[];
}

export const Reactions: React.FC<ReactionsProps> = ({ reactions }) => {
  const [visibleReactions, setVisibleReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    setVisibleReactions(reactions);
    const timer = setTimeout(() => {
      setVisibleReactions([]);
    }, 5000);
    return () => clearTimeout(timer);
  }, [reactions]);

  return (
    <div className="reactions-container">
      {visibleReactions.map(reaction => (
        <div key={reaction.id} className="reaction-emoji">
          {reaction.emoji}
        </div>
      ))}
    </div>
  );
};
