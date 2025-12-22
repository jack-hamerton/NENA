import React, { useState } from 'react';
import styled from 'styled-components';

const PollsContainer = styled.div`
  padding: 20px;
`;

const PollContainer = styled.div`
  margin-bottom: 20px;
`;

const PollQuestion = styled.h3`
  margin-bottom: 10px;
`;

const PollOption = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const VoteButton = styled.button`
  background-color: ${props => props.theme.palette.accent};
  color: ${props => props.theme.text.primary};
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

const CreatePollForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const CreatePollInput = styled.input`
  margin-bottom: 10px;
`;

const CreatePollButton = styled.button`
  background-color: ${props => props.theme.palette.accent};
  color: ${props => props.theme.text.primary};
  border: none;
  padding: 10px;
  cursor: pointer;
`;

export const Polls = ({ polls, onCreatePoll, onVote }) => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreatePoll({ question, options });
    setQuestion('');
    setOptions(['', '']);
    setShowCreatePoll(false);
  };

  return (
    <PollsContainer>
      <CreatePollButton onClick={() => setShowCreatePoll(!showCreatePoll)}>
        {showCreatePoll ? 'Cancel' : 'Create Poll'}
      </CreatePollButton>

      {showCreatePoll && (
        <CreatePollForm onSubmit={handleSubmit}>
          <CreatePollInput
            type="text"
            placeholder="Poll Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          {options.map((option, index) => (
            <CreatePollInput
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          ))}
          <button type="button" onClick={handleAddOption}>Add Option</button>
          <CreatePollButton type="submit">Create</CreatePollButton>
        </CreatePollForm>
      )}

      {polls.map((poll) => (
        <PollContainer key={poll.id}>
          <PollQuestion>{poll.question}</PollQuestion>
          {poll.options.map((option) => (
            <PollOption key={option.id}>
              <span>{option.text}</span>
              <span>
                {option.votes.length} votes
                <VoteButton onClick={() => onVote(poll.id, option.id)}>
                  Vote
                </VoteButton>
              </span>
            </PollOption>
          ))}
        </PollContainer>
      ))}
    </PollsContainer>
  );
};
