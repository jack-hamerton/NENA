
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

export const StudioContainer = styled.div`
  padding: 1rem;
  background-color: #f0f2f5;
  min-height: 100vh;

  ${up('md')} {
    padding: 2rem;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => (props.active ? props.theme.palette.primary : '#fff')};
  color: ${props => (props.active ? '#fff' : '#333')};
  border: 1px solid ${props => (props.active ? props.theme.palette.primary : '#ccc')};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  margin: 0.25rem;

  &:hover {
    background-color: ${props => (props.active ? props.theme.palette.primary : '#f0f0f0')};
  }

  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

export const ContentContainer = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  ${up('md')} {
    padding: 2rem;
  }
`;

export const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  ${up('md')} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${up('lg')} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const ChartCard = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  grid-column: span 1;

  ${up('md')} {
    /* Default to full width on medium screens */
    grid-column: span 2;
  }

  ${up('lg')} {
      /* Default to 1/3 width on large screens */
      grid-column: span 1;
  }

  /* Specific overrides for larger cards */
  &:nth-of-type(5) { /* QualTable */
    ${up('lg')} {
      grid-column: span 3;
    }
  }

  &:nth-of-type(6) { /* WordCloud */
    ${up('lg')} {
      grid-column: span 2;
    }
  }
  
  &:nth-of-type(8) { /* Key Quotes */
    ${up('lg')} {
      grid-column: span 3;
    }
  }
`;
