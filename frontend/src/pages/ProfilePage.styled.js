
import styled from 'styled-components';

export const ProfilePageContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};
`;

export const HeaderSection = styled.section`
  text-align: center;
  margin-bottom: 2rem;
`;

export const SpiderWebCanvasSection = styled.section`
  height: 400px;
  margin-bottom: 2rem;
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
  justify-content: center;
  gap: 1rem;
`;
