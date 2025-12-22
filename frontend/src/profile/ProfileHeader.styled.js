
import styled from 'styled-components';

export const ProfileHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const ProfilePicture = styled.div`
  position: relative;
  margin-right: 20px;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid ${({ theme }) => theme.palette.secondary};
  }
`;

export const RoleBadge = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${({ theme }) => theme.palette.accent};
  color: ${({ theme }) => theme.text.primary};
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
`;

export const ProfileInfo = styled.div`
  h2 {
    margin: 0;
    color: ${({ theme }) => theme.text.primary};
  }

  .handle {
    color: ${({ theme }) => theme.text.secondary};
    margin-bottom: 10px;
  }

  .tagline {
    font-style: italic;
    color: ${({ theme }) => theme.text.primary};
  }
`;

export const FollowSection = styled.div`
  .intent-options {
    display: flex;
    flex-direction: column;
    position: absolute;
    background-color: ${({ theme }) => theme.palette.primary};
    border-radius: 5px;
    margin-top: 5px;

    button {
      background-color: transparent;
      color: ${({ theme }) => theme.text.primary};
      border: none;
      padding: 10px;
      text-align: left;
      cursor: pointer;

      &:hover {
        background-color: ${({ theme }) => theme.palette.tertiary};
      }
    }
  }
`;
