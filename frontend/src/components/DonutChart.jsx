
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ data }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const width = 200;
    const height = 200;
    const margin = 10;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

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

  }, [data]);

  return <svg ref={ref}></svg>;
};

export default DonutChart;
