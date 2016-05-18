/* global d3 */

const margin = { top: 30, right: 20, bottom: 20, left: 30 };

const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const buildChart = (data) => {
  // todo compare
  const colorScale = d3.scale.quantize()
    .domain(d3.extent(data, d => d.variance))
    .range(['#2166ac', '#4393c3', '#92c5de', '#d1e5f0', '#f7f7f7',
      '#fddbc7', '#f4a582', '#d6604d', '#b2182b']);

  const xScale = d3.scale.ordinal()
    .domain(d3.range(data.length / 12))
    .rangeBands([0, width]);

  const yScale = d3.scale.ordinal()
    .domain(d3.range(12))
    .rangeBands([0, height], 0.01, 0);

  const svg = d3.select('#root')
  .append('svg')
    .attr('class', 'chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  svg.selectAll('rect')
    .data(data)
    .enter().append('rect')
    .attr('id', (d, i) => i)
    .attr('x', (d, i) => xScale(Math.floor(i / 12)))
    .attr('y', (d, i) => yScale(i % 12))
    .attr('width', xScale.rangeBand())
    .attr('height', yScale.rangeBand())
    .style('fill', d => colorScale(d.variance));
};
// use remote file on codepen
// d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', (error, data) => {
d3.json('../temp/global-temperature.json', (error, data) => {
  // if (error) {
  //   console.log(error);
  // }
  // console.log(data);
  buildChart(data.monthlyVariance);
});
