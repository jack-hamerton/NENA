import styled from 'styled-components';

const StudyContainer = styled.div`
  padding: 2rem;
  color: ${props => props.theme.text};
`;

const StudyPage = () => {
  return (
    <StudyContainer>
      <h1>Study</h1>
      <p>Let's get to studying!</p>
    </StudyContainer>
  );
};

export default StudyPage;
