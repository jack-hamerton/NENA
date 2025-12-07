import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const NavContainer = styled.nav`
  width: 200px;
  background-color: ${props => props.theme.colors.primary};
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledLink = styled(NavLink)`
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  font-family: ${props => props.theme.fonts.body};
  margin: 10px 0;
  font-size: 1.2em;

  &.active {
    font-weight: bold;
  }
`;

const LeftNav = () => {
  return (
    <NavContainer>
      <StyledLink to="/" end>Feed</StyledLink>
      <StyledLink to="/discover">Discover</StyledLink>
      <StyledLink to="/messages">Messages</StyledLink>
      <StyledLink to="/rooms">Rooms</StyledLink>
      <StyledLink to="/study">Study</StyledLink>
      <StyledLink to="/music">Music</StyledLink>
      <StyledLink to="/podcasts">Podcasts</StyledLink>
    </NavContainer>
  );
};

export default LeftNav;
