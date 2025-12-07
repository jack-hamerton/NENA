import styled from 'styled-components';

const StudyContainer = styled.div`
  color: ${(props) => props.theme.text};
`;

const StudyPage = () => {
  return (
    <StudyContainer>
      <h1>Study</h1>
      {/* Study content will be displayed here */}
    </StudyContainer>
  );
};

export default StudyPage;
