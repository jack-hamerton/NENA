
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import d3Cloud from 'd3-cloud';

const WordCloud = ({ words, title }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !words) return;

    // Clear previous render
    d3.select(ref.current).selectAll('*').remove();

    const width = 350;
    const height = 250;

    const layout = d3Cloud()
      .size([width, height])
      .words(words.map(d => ({ text: d, size: 10 + Math.random() * 90 }))) // Size is randomized for visual effect
      .padding(5)
      .rotate(() => (~~(Math.random() * 6) - 3) * 30) // Random rotation
      .fontSize(d => d.size)
      .on('end', draw);

    layout.start();

    function draw(words) {
      const svg = d3.select(ref.current)
        .attr('width', layout.size()[0])
        .attr('height', layout.size()[1])
        .append('g')
        .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`);

      svg.selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Impact')
        .style('fill', (d, i) => d3.schemeCategory10[i % 10]) // Use a color scale
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text);

      // Add title
      svg.append('text')
        .attr('x', 0)
        .attr('y', - (layout.size()[1] / 2) + 20) // Position at the top
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(title);
    }

  }, [words, title]);

  return <svg ref={ref}></svg>;
};

export default WordCloud;
