
import styled from 'styled-components';

export const Card = styled.div`
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  border: 1px solid ${({ theme }) => theme.palette.divider};

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }

  h3 {
    color: ${({ theme }) => theme.palette.text.primary};
    margin: 0.5rem 1rem;
  }

  p {
    color: ${({ theme }) => theme.palette.text.secondary};
    margin: 0 1rem 0.5rem;
  }
`;
