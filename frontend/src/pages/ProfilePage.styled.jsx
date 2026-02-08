
import styled from 'styled-components';

export const ProfilePageContainer = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};

  @media (min-width: 900px) {
    padding: 2rem;
  }
`;

export const HeaderSection = styled.section`
  text-align: center;
  margin-bottom: 2rem;
`;

export const SpiderWebCanvasSection = styled.section`
  height: 300px;
  margin-bottom: 2rem;

  @media (min-width: 900px) {
    height: 400px;
  }
`;

export const ContentSection = styled.section`
  margin-bottom: 2rem;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  h5 {
    color: ${props => props.theme.palette.secondary};
  }
`;

export const MetricsSection = styled.section`
  background-color: ${props => props.theme.palette.primary};
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

export const ProfileFooter = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: center;
  }
`;
