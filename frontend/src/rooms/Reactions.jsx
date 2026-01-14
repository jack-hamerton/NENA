import React, { useState, useEffect } from 'react';
import './Reactions.css';

export const Reactions= ({ reactions }) => {
  const [visibleReactions, setVisibleReactions] = useState([]);

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
