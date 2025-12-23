
import React, { useState } from 'react';
import styled from 'styled-components';
import { voteOnPoll } from '../services/poll.service';

const PollContainer = styled.div`
  margin-top: 1rem;
`;

const PollOption = styled.div`
  background-color: ${props => props.theme.palette.background.default};
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border: 1px solid ${props => (props.isSelected ? props.theme.palette.accent : 'transparent')};

  &:hover {
    border-color: ${props => props.theme.palette.accent};
  }
`;

const FeedPoll = ({ poll, postId }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [totalVotes, setTotalVotes] = useState(poll.options.reduce((acc, option) => acc + option.votes, 0));

  const handleVote = async (optionId) => {
    try {
      await voteOnPoll(postId, poll.id, optionId);
      setSelectedOption(optionId);
      setTotalVotes(totalVotes + 1);
    } catch (error) {
      console.error('Failed to vote on poll:', error);
    }
  };

  return (
    <PollContainer>
      {poll.options.map(option => (
        <PollOption 
          key={option.id} 
          onClick={() => handleVote(option.id)}
          isSelected={selectedOption === option.id}
        >
          {option.text}
          {selectedOption && 
            <span> - {Math.round((option.votes / totalVotes) * 100)}%</span>
          }
        </PollOption>
      ))}
    </PollContainer>
  );
};

export default FeedPoll;
