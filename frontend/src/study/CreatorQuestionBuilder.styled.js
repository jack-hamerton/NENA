
import styled from 'styled-components';

export const BuilderContainer = styled.div`
  background-color: ${({ theme }) => theme.palette.primary};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text.primary};
`;

export const Label = styled.label`
  display: block;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.palette.highlight};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.palette.background};
  color: ${({ theme }) => theme.text.primary};
  &:focus {
    outline: none;
    ring: 2px;
    ring-color: ${({ theme }) => theme.palette.secondary};
  }
`;

export const Input = styled.input`
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.palette.highlight};
  border-radius: 8px 0 0 8px;
  background-color: ${({ theme }) => theme.palette.background};
  color: ${({ theme }) => theme.text.primary};
  &:focus {
    outline: none;
    ring: 2px;
    ring-color: ${({ theme }) => theme.palette.secondary};
  }
`;

export const Button = styled.button`
  background-color: ${({ theme }) => theme.palette.secondary};
  color: ${({ theme }) => theme.text.primary};
  padding: 0.75rem 1.5rem;
  border-radius: 0 8px 8px 0;
  &:hover {
    background-color: ${({ theme }) => theme.palette.secondary_dark};
  }
  &:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
  }
`;

export const QuestionList = styled.ul`
  list-style-type: decimal;
  list-style-position: inside;
  background-color: ${({ theme }) => theme.palette.background};
  padding: 1rem;
  border-radius: 8px;
  max-height: 240px;
  overflow-y: auto;
`;

export const QuestionItem = styled.li`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: ${({ type, theme }) => type === 'quantitative' ? theme.palette.highlight : theme.palette.primary};
`;
