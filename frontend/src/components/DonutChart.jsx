
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ data, title }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !data) return;

    // Clear previous render
    d3.select(ref.current).selectAll('*').remove();

    const width = 200;
    const height = 220; // Increased height to accommodate title
    const margin = 10;
    const radius = Math.min(width, height - 40) / 2 - margin; // Adjust radius for title

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${(height / 2) + 10})`); // Adjust vertical translation

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.value);
    const data_ready = pie(data);

    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    svg.selectAll('path')
      .data(data_ready)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.name));

    // Add title
    svg.append('text')
        .attr('x', 0)
        .attr('y', - (height / 2) + 10) // Position at the top
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(title);

  }, [data, title]);

  return <svg ref={ref}></svg>;
};

export default DonutChart;
