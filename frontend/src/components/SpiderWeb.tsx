
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './SpiderWeb.css';
import { api } from '../utils/api';

const SpiderWeb = ({ collaborationId }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const fetchData = async () => {
      if (!collaborationId) return;

      const challengesRes = await api.get(`/collaborations/${collaborationId}/challenges`, {}, {});
      const challenges = challengesRes.data;

      const userIds = new Set();
      challenges.forEach(c => userIds.add(c.creator_id));

      const mitigationsPromises = challenges.map(c => api.get(`/challenges/${c.id}/mitigations`, {}), {});
      const mitigationsRes = await Promise.all(mitigationsPromises);
      const mitigations = mitigationsRes.flatMap(res => res.data);

      mitigations.forEach(m => userIds.add(m.creator_id));

      const usersPromises = Array.from(userIds).map(id => api.get(`/users/${id}`, {}), {});
      const usersRes = await Promise.all(usersPromises);
      const users = usersRes.map(res => res.data);

      const impactScoresPromises = users.map(u => api.get(`/users/${u.id}/impact-score`, {}), {});
      const impactScoresRes = await Promise.all(impactScoresPromises);
      const impactScores = impactScoresRes.map(res => res.data);

      const userImpactMapping = users.reduce((acc, user, index) => {
        acc[user.id] = impactScores[index];
        return acc;
      }, {});

      const nodes = [
        ...users.map(u => ({ id: u.email, group: 'user', impact: userImpactMapping[u.id] })),
        ...challenges.map(c => ({ id: c.id, group: 'challenge' })),
        ...mitigations.map(m => ({ id: m.id, group: 'mitigation' }))
      ];

      const links = [
        ...challenges.map(c => ({ source: users.find(u => u.id === c.creator_id)?.email, target: c.id })),
        ...mitigations.map(m => ({ source: users.find(u => u.id === m.creator_id)?.email, target: m.id }))
      ];

      setGraphData({ nodes, links });
    };

    fetchData();
  }, [collaborationId]);

  useEffect(() => {
    if (!ref.current || !graphData.nodes.length) return;

    const { nodes, links } = graphData;
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

  }, [graphData]);

  return (
    <div className="spider-web-container">
      <svg ref={ref}></svg>
    </div>
  );
};

export default SpiderWeb;
