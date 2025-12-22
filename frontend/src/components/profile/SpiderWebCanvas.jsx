
import React, { useState, useMemo } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import styled from 'styled-components';
import CustomNode from './CustomNode';

const CanvasContainer = styled.div`
  height: 500px;
  background-color: #1a1a1a;
  border-radius: 8px;
  margin-bottom: 2rem;
  position: relative;
`;

const Tooltip = styled.div`
  position: absolute;
  background: rgba(40, 40, 40, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.85rem;
  pointer-events: none;
  z-index: 100;
  white-space: nowrap;
`;

const FilterContainer = styled.div`
    position: absolute;
    top: 1rem;
    left: 1rem;
    z-index: 10;
    display: flex;
    gap: 0.5rem;
`;

const FilterButton = styled.button`
    background-color: ${props => props.active ? props.color : '#444'};
    color: white;
    border: 1px solid ${props => props.color};
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;

    &:hover {
        opacity: 0.9;
    }
`;

const nodeTypes = { custom: CustomNode };

const SpiderWebCanvas = ({ nodes, edges }) => {
  const [tooltip, setTooltip] = useState(null);
  const [filters, setFilters] = useState({ supporter: true, amplifier: true, learner: true });

  const onEdgeMouseEnter = (event, edge) => {
    if (edge.label) {
      setTooltip({ content: edge.label, x: event.clientX, y: event.clientY });
    }
  };

  const onEdgeMouseLeave = () => setTooltip(null);
  
  const onEdgeMouseMove = (event) => {
      if (tooltip) {
          setTooltip(prev => ({...prev, x: event.clientX, y: event.clientY}));
      }
  }

  const onNodeClick = (_, node) => console.log(`Navigating to profile of ${node.data.label}`);

  const toggleFilter = (intent) => {
      setFilters(prev => ({...prev, [intent]: !prev[intent]}));
  }

  const filteredEdges = useMemo(() => {
      const activeFilters = Object.keys(filters).filter(key => filters[key]);
      // Always include edges that don't have a specific intent (e.g., incoming follows)
      return edges.filter(edge => !edge.data?.intent || activeFilters.includes(edge.data.intent));
  }, [edges, filters]);

  return (
    <CanvasContainer>
      {tooltip && <Tooltip style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}>{tooltip.content}</Tooltip>}
      <FilterContainer>
          <FilterButton color="#2ecc71" active={filters.supporter} onClick={() => toggleFilter('supporter')}>Supporters</FilterButton>
          <FilterButton color="#e67e22" active={filters.amplifier} onClick={() => toggleFilter('amplifier')}>Amplifiers</FilterButton>
          <FilterButton color="#3498db" active={filters.learner} onClick={() => toggleFilter('learner')}>Learners</FilterButton>
      </FilterContainer>
      <ReactFlow
        nodes={nodes.map(node => ({...node, type: 'custom'}))} // Use custom node type
        edges={filteredEdges}
        nodeTypes={nodeTypes}
        onEdgeMouseEnter={onEdgeMouseEnter}
        onEdgeMouseLeave={onEdgeMouseLeave}
        onEdgeMouseMove={onEdgeMouseMove}
        onNodeClick={onNodeClick}
        fitView
      >
        <Controls />
        <MiniMap nodeColor={n => n.data.color || '#555'}/>
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </CanvasContainer>
  );
};

export default SpiderWebCanvas;
