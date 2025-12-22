
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SpiderWebContainer } from './SpiderWeb.styled';

// Mock data representing intentional follows
const mockGraphData = {
  nodes: [
    { id: 'user-1', name: 'Elena Rodriguez', role: '🎤 Storyteller', group: 'center' },
    { id: 'user-2', name: 'John Doe', role: '👀 Learner', group: 'follower' },
    { id: 'user-3', name: 'Jane Smith', role: '👑 Advocate', group: 'follower' },
    { id: 'user-4', name: 'Sam Wilson', role: '🎤 Storyteller', group: 'follower' },
    { id: 'user-5', name: 'Maria Garcia', role: 'supporter', group: 'follower' },

  ],
  links: [
    { source: 'user-1', target: 'user-2', intent: 'Learner', note: 'Learning from your stories!' },
    { source: 'user-1', target: 'user-3', intent: 'Amplifier', note: 'Amplifying your advocacy.' },
    { source: 'user-1', target: 'user-4', intent: 'Supporter', note: 'Supporting your projects.' },
    { source: 'user-5', target: 'user-1', intent: 'Learner', note: 'Inspired by your work.' },
  ]
};

const SpiderWeb = () => {
  const ref = useRef();

  useEffect(() => {
    const { nodes, links } = mockGraphData;
    const width = 600;
    const height = 400;

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height);

    // Clear previous render
    svg.selectAll('*').remove();

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('class', d => `link ${d.intent.toLowerCase()}`)
      .style('stroke-width', 2);

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 10)
      .attr('class', d => `node ${d.group}`)
      .call(drag(simulation));

    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => `${d.role.split(' ')[0]} ${d.name}`)
      .attr('x', 15)
      .attr('y', 4)
      .attr('class', 'node-label');
      
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    link.on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', .9);
      tooltip.html(`Intent: ${d.intent}<br/>Note: "${d.note}"`) 
        .style('left', (event.pageX) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0);
    });

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

  }, []);

  const drag = (simulation) => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  return (
    <SpiderWebContainer>
      <svg ref={ref}></svg>
    </SpiderWebContainer>
  );
};

export default SpiderWeb;
