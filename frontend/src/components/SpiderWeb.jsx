
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './SpiderWeb.css';
import { api } from '../utils/api';

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: string;
  impact?: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string;
  target: string;
}

const SpiderWeb = ({ collaborationId }: { collaborationId: string }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({ nodes: [], links: [] });

  useEffect(() => {
    const fetchData = async () => {
      if (!collaborationId) return;

      const challengesRes = await api.get(`/collaborations/${collaborationId}/challenges`, {});
      const challenges = challengesRes.data;

      const userIds = new Set<string>();
      challenges.forEach(c => userIds.add(c.creator_id));

      const mitigationsPromises = challenges.map(c => api.get(`/challenges/${c.id}/mitigations`, {}));
      const mitigationsRes = await Promise.all(mitigationsPromises);
      const mitigations = mitigationsRes.flatMap(res => res.data);

      mitigations.forEach(m => userIds.add(m.creator_id));

      const usersPromises = Array.from(userIds).map(id => api.get(`/users/${id}`, {}));
      const usersRes = await Promise.all(usersPromises);
      const users = usersRes.map(res => res.data);

      const impactScoresPromises = users.map(u => api.get(`/users/${u.id}/impact-score`, {}));
      const impactScoresRes = await Promise.all(impactScoresPromises);
      const impactScores = impactScoresRes.map(res => res.data);

      const userImpactMapping = users.reduce((acc, user, index) => {
        acc[user.id] = impactScores[index];
        return acc;
      }, {} as { [key: string]: number });

      const nodes: GraphNode[] = [
        ...users.map(u => ({ id: u.email, group: 'user', impact: userImpactMapping[u.id] })),
        ...challenges.map(c => ({ id: c.id, group: 'challenge' })),
        ...mitigations.map(m => ({ id: m.id, group: 'mitigation' }))
      ];

      const links: GraphLink[] = [
        ...challenges.map(c => ({ source: users.find(u => u.id === c.creator_id)?.email || '', target: c.id })),
        ...mitigations.map(m => ({ source: users.find(u => u.id === m.creator_id)?.email || '', target: m.id }))
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

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => (d as GraphNode).id))
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
      .attr('class', d => d.group);

    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.id)
      .attr('x', 8)
      .attr('y', 3);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    node.on('mouseover', (event, d) => {
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
        .attr('x1', d => (d.source as GraphNode).x || 0)
        .attr('y1', d => (d.source as GraphNode).y || 0)
        .attr('x2', d => (d.target as GraphNode).x || 0)
        .attr('y2', d => (d.target as GraphNode).y || 0);

      node
        .attr('cx', d => d.x || 0)
        .attr('cy', d => d.y || 0);

      label
        .attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

  }, [graphData]);

  return (
    <div className="spider-web-container">
      <svg ref={ref}></svg>
    </div>
  );
};

export default SpiderWeb;
