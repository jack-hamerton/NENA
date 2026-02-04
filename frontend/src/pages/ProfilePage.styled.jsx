
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

export const ProfilePageContainer = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};

  ${up('md')} {
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

  ${up('md')} {
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

  ${up('sm')} {
    flex-direction: row;
    justify-content: center;
  }
`;
