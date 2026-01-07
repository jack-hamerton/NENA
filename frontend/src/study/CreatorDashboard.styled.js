
import styled from 'styled-components';

export const DashboardContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.palette.background};
  min-height: 100vh;
`;

export const Header = styled.header`
  margin-bottom: 3rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text.primary};
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  margin-top: 0.5rem;
`;

export const Section = styled.section`
  margin-bottom: 3rem;
`;

export const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.palette.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  color: ${({ theme }) => theme.text.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
  }
`;
