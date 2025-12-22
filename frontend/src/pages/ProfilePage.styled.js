
import styled from 'styled-components';

export const ProfilePageContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
  color: ${({ theme }) => theme.text.primary};
`;

export const ProfileBody = styled.div`
  .tabs {
    border-bottom: 1px solid ${({ theme }) => theme.palette.dark};
    margin-bottom: 20px;

    button {
      background: none;
      border: none;
      color: ${({ theme }) => theme.text.secondary};
      padding: 10px 20px;
      cursor: pointer;
      font-size: 1rem;

      &.active {
        color: ${({ theme }) => theme.text.primary};
        border-bottom: 2px solid ${({ theme }) => theme.palette.secondary};
      }
    }
  }
`;

export const PodcastsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

export const ProfileMetrics = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.dark};
  border-radius: 8px;
`;

export const ProfileFooter = styled.footer`
  margin-top: 40px;
  padding: 20px;
  background-color: ${({ theme }) => theme.palette.dark};
  border-radius: 8px;

  button {
    margin-top: 10px;
    background-color: ${({ theme }) => theme.palette.primary};
    color: ${({ theme }) => theme.text.primary};
    border: 1px solid ${({ theme }) => theme.palette.tertiary};
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.palette.tertiary};
    }
  }
`;
