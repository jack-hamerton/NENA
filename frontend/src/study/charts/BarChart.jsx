
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, title }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !data) return;

    // Clear previous render
    d3.select(ref.current).selectAll('*').remove();

    const width = 300;
    const height = 220;
    const margin = { top: 40, right: 20, bottom: 50, left: 40 };

    const svg = d3.select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.name))
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-35)');

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value))
      .attr('fill', '#69b3a2');

    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 0 - (margin.top / 2) + 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(title);

  }, [data, title]);

  return <svg ref={ref}></svg>;
};

export default BarChart;
