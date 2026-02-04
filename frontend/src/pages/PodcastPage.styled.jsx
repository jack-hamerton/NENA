
import styled from 'styled-components';
import { up } from 'styled-breakpoints';

export const PodcastPageContainer = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.palette.dark};
  color: ${props => props.theme.text.primary};

  ${up('md')} {
    padding: 2rem;
  }
`;

export const PodcastListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;

  ${up('sm')} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${up('lg')} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const SocialFeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;

  ${up('md')} {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
`;

export const AdditionalFeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 2rem;

  ${up('md')} {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
`;
