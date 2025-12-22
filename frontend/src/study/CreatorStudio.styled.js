
import styled from 'styled-components';

export const StudioContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.palette.background};
`;

export const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;

export const TabButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: ${props => props.active ? props.theme.palette.primary : 'transparent'};
  border-bottom: ${props => props.active ? `2px solid ${props.theme.palette.secondary}` : '2px solid transparent'};
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  font-size: 16px;
`;

export const ContentContainer = styled.div``;

export const ChartGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
`;
