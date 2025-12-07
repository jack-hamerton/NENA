import styled from 'styled-components';

const SearchInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1em;
  margin-bottom: 20px;
`;

const GlobalSearchBox = () => {
  return <SearchInput placeholder="Search for profiles, skills, interests..." />;
};

export default GlobalSearchBox;
