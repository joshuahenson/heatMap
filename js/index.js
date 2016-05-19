/* global d3 */

const margin = { top: 30, right: 20, bottom: 40, left: 60 };

const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const tooltip = d3.select('#root').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

// primary function to build chart
const buildChart = (data, baseTemp) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const colorScale = d3.scale.quantize()
    .domain(d3.extent(data, d => d.variance))
    .range(['#053061', '#2166ac', '#4393c3', '#92c5de', '#d1e5f0', '#f7f7f7',
      '#fddbc7', '#f4a582', '#d6604d', '#b2182b', '#67001f']);

  const monthScale = d3.time.scale()
    .domain([new Date(2015, 0, 1), new Date(2015, 11, 31)])
    .range([0, height]);

  const minDate = new Date(data[0].year, 0, 1);
  const maxDate = new Date(data[data.length - 1].year, 11, 31);
  const yearScale = d3.time.scale()
    .domain([minDate, maxDate])
    .range([0, width]);

  const xScale = d3.scale.ordinal()
    .domain(d3.range(data.length / 12))
    .rangeBands([0, width], 0, 0);

  const yScale = d3.scale.ordinal()
    .domain(d3.range(12))
    .rangeBands([0, height], 0, 0);

  const xAxis = d3.svg.axis()
    .scale(yearScale)
    .orient('bottom')
    .ticks(d3.time.year, 25);

  const yAxis = d3.svg.axis()
    .scale(monthScale)
    .ticks(d3.time.months)
    .tickFormat(d3.time.format('%b'))
    .orient('left');

  const svg = d3.select('#root')
    .append('svg')
      .attr('class', 'chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // append colored temp rects
  svg.selectAll('rect')
    .data(data)
    .enter().append('rect')
    .attr('x', (d, i) => xScale(Math.floor(i / 12)))
    .attr('y', (d, i) => yScale(i % 12))
    .attr('width', xScale.rangeBand())
    .attr('height', yScale.rangeBand())
    .style('fill', d => colorScale(d.variance))
    .style('stroke', 'gray')
    .style('stroke-width', 0.1)
    .on('mouseover', d => {
      tooltip.transition()
        .style('opacity', 1);
      tooltip.html(`<h3>${months[d.month - 1]} ${d.year}</h3>
        ${(baseTemp + d.variance).toFixed(2)}&deg;C`)
          .style('left', `${d3.event.pageX + 20}px`)
          .style('top', `${d3.event.pageY - 30}px`);
    })
    .on('mouseout', () => {
      tooltip.transition()
        .style('opacity', 0);
    });

  // append x axis & label
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)
  .append('text')
    .attr('class', 'label')
    .attr('x', width / 2)
    .attr('y', margin.bottom)
    .text('Year');

  // append y axis
  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .selectAll('text')
       .attr('transform', `translate(0, ${yScale.rangeBand() / 2})`); // center ticks

  // append y axis label
  d3.select('.y')
    .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 10)
      .attr('x', -height / 2)
      .text('Month');
};
// use remote file on codepen
// d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', (error, data) => {
d3.json('../temp/global-temperature.json', (error, data) => {
  // if (error) {
  //   console.log(error);
  // }
  // console.log(data);
  buildChart(data.monthlyVariance, data.baseTemperature);
});
