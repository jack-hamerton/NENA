
import React from 'react';
import styled from 'styled-components';
import { Handle } from '@xyflow/react';

const NodeContainer = styled.div`
  background: #333;
  border: 2px solid ${props => props.color || '#555'};
  border-radius: 50%;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  text-align: center;
`;

const RoleBadge = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.2rem;
`;

const CustomNode = ({ data, ...props }) => {
  const colorMap = {
    supporter: '#2ecc71',
    amplifier: '#e67e22',
    learner: '#3498db',
    default: '#555'
  };

  const nodeColor = colorMap[data.intent] || colorMap.default;

  return (
    <NodeContainer color={nodeColor}>
        <Handle type="target" position="top" />
        <Handle type="source" position="bottom" />
        {data.role && <RoleBadge>{data.role.icon}</RoleBadge>}
        <div>{data.label}</div>
    </NodeContainer>
  );
};

export default CustomNode;
