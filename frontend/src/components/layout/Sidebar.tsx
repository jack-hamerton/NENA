import styled from 'styled-components';

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: ${props => props.theme.background};
  border-right: 1px solid ${props => props.theme.borderColor};
  padding: 20px;
`;

export const Sidebar = () => {
  return (
    <SidebarContainer>
      {/* Navigation links will go here */}
    </SidebarContainer>
  );
};
