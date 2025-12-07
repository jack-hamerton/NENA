
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './SpiderWeb.css';

const SpiderWeb = () => {
    const ref = useRef<SVGSVGElement>(null);
    const [data, setData] = useState<{ nodes: any[], links: any[] } | null>(null);

    useEffect(() => {
        fetch('/api/connections/123') // Assuming a user ID of 123 for now
            .then(res => res.json())
            .then(data => setData(data));
    }, []);

    useEffect(() => {
        if (!ref.current || !data) return;

        const { nodes, links } = data;
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

    }, [data]);

    return (
        <div className="spider-web-container">
            <svg ref={ref}></svg>
        </div>
    );
};

export default SpiderWeb;
