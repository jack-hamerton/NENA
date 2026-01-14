
import styled from 'styled-components';

export const PostContainer = styled.div`
  background-color: ${({ theme }) => theme.palette.primary};
  border: 1px solid ${({ theme }) => theme.palette.highlight};
  border-radius: 8px;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text.primary};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

  &.reported {
    opacity: 0.5;
    background-color: ${({ theme }) => theme.palette.dark};
  }
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
`;

export const AuthorLink = styled.a`
  font-weight: bold;
  color: ${({ theme }) => theme.text.primary};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const Timestamp = styled.span`
  color: ${({ theme }) => theme.text.secondary};
  margin-left: 0.5rem;
  font-size: 0.9rem;
`;

export const MoreOptionsButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  margin-left: auto;
`;

export const Content = styled.div`
  padding: 0 1rem 1rem;
  white-space: pre-wrap; /* Preserves line breaks and spacing */
  line-height: 1.5;
`;

export const HashtagLink = styled.a`
  color: ${({ theme }) => theme.palette.accent};
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export const MediaWrapper = styled.div`
  max-height: 600px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
`;

export const StyledMedia = styled.img` /* Using img for both video/image for simplicity */
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
`;

export const ActionsBar = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.palette.highlight};
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 4px;

  &:hover {
    color: ${({ theme }) => theme.palette.accent};
    background-color: ${({ theme }) => theme.palette.dark};
  }
`;
