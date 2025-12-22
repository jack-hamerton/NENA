
import styled from 'styled-components';

export const DashboardContainer = styled.div`
  padding: 4rem;
  background-color: ${({ theme }) => theme.palette.background};
  min-height: 100vh;
`;

export const Header = styled.header`
  margin-bottom: 6rem;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text.primary};
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.text.secondary};
`;

export const Section = styled.section`
  margin-bottom: 6rem;
`;

export const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 4rem;
  color: ${({ theme }) => theme.text.primary};
`;

export const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;
