import styled from 'styled-components';
import { Link } from 'react-router-dom';

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 100px;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 0 10px 10px 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.text.primary};
  text-decoration: none;
  margin-bottom: 15px;

  &:hover {
    color: ${props => props.theme.accent};
  }
`;

export const Sidebar = () => {
  return (
    <SidebarContainer>
      <NavLink to="/messages">Messages</NavLink>
    </SidebarContainer>
  );
};
