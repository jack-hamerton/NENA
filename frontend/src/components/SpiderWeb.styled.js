
import styled from 'styled-components';

export const SpiderWebContainer = styled.div`
  width: 100%;
  height: 400px;

  .node.center {
    fill: ${({ theme }) => theme.palette.secondary};
  }

  .node.follower {
    fill: ${({ theme }) => theme.palette.primary};
  }

  .link {
    stroke: ${({ theme }) => theme.palette.tertiary};
  }

  .node-label {
    fill: ${({ theme }) => theme.text.primary};
    font-size: 0.8rem;
  }

  .tooltip {
    position: absolute;
    text-align: center;
    padding: 8px;
    font: 12px sans-serif;
    background: ${({ theme }) => theme.palette.accent};
    border: 0px;
    border-radius: 8px;
    pointer-events: none;
    color: ${({ theme }) => theme.text.primary};
  }
`;
