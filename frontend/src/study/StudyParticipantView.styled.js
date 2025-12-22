
import styled, { keyframes } from 'styled-components';

export const ParticipantContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.palette.primary};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;
`;

export const Subtitle = styled.h2`
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;
`;

export const BodyText = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 2rem;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const TextInput = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.palette.highlight};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.palette.background};
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;
`;

export const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.palette.secondary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  color: red;
  margin-top: 1rem;
`;

export const QuestionList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const QuestionListItem = styled.li`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.palette.background};
`;

export const QuestionText = styled.p`
  font-weight: bold;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 1rem;
`;

export const RadioGroupContainer = styled.div``;

export const RadioLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text.secondary};
`;

export const RadioInput = styled.input`
  margin-right: 0.5rem;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Loader = styled.div`
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid ${({ theme }) => theme.palette.secondary}; /* Blue */
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: ${spin} 2s linear infinite;
`;
