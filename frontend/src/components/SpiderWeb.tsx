
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './SpiderWeb.css';

// Mock data for the collaboration graph
const mockData = {
  nodes: [
    { id: 'User A', group: 'user', impact: 0.75 },
    { id: 'User B', group: 'user', impact: 0.5 },
    { id: 'User C', group: 'user', impact: 0.9 },
    { id: 'Challenge 1', group: 'challenge' },
    { id: 'Mitigation 1', group: 'mitigation' },
  ],
  links: [
    { source: 'User A', target: 'Challenge 1' },
    { source: 'User B', target: 'Challenge 1' },
    { source: 'User C', target: 'Challenge 1' },
    { source: 'User A', target: 'Mitigation 1' },
  ],
};

const SpiderWeb = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const { nodes, links } = mockData;
    const width = 600;
    const height = 400;

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody())
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
      .attr('class', 'link');

    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('class', (d: any) => d.group);

    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d: any) => d.id)
      .attr('x', 8)
      .attr('y', 3);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    node.on('mouseover', (event, d: any) => {
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip.html(`User: ${d.id}<br/>Impact: ${d.impact ? (d.impact * 100).toFixed(0) + '%' : 'N/A'}`)
        .style('left', (event.pageX) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

  }, []);

  return (
    <div className="spider-web-container">
      <svg ref={ref}></svg>
    </div>
  );
};

export default SpiderWeb;
