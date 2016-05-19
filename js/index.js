/* global d3 */

const margin = { top: 10, right: 20, bottom: 40, left: 60 };

const width = 1200 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const colors = ['#053061', '#2166ac', '#4393c3', '#92c5de', '#d1e5f0', '#f7f7f7',
  '#fddbc7', '#f4a582', '#d6604d', '#b2182b', '#67001f'];

const tooltip = d3.select('#root').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

d3.select('#root').append('h1')
  .html('Global Land Surface Temperature');

// primary function to build chart
const buildChart = (data, baseTemp) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const colorScale = d3.scale.quantize()
    .domain(d3.extent(data, d => d.variance))
    .range(colors);

  const monthScale = d3.time.scale()
    .domain([new Date(2015, 0, 1), new Date(2015, 11, 31)])
    .range([0, height]);

  const minYear = data[0].year;
  const maxYear = data[data.length - 1].year;
  const minDate = new Date(minYear, 0, 1);
  const maxDate = new Date(maxYear, 11, 31);
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
      .attr('y', -margin.left + 11)
      .attr('x', -height / 2)
      .text('Month');
};


const buildKey = (data, baseTemp) => {
  const keyPadding = 40;
  const keyWidth = ((width + margin.left + margin.right) / 2) - (keyPadding * 2);
  const keyHeight = 60;

  const minTemp = d3.min(data, d => d.variance + baseTemp);
  const maxTemp = d3.max(data, d => d.variance + baseTemp);
  const tempSpread = (maxTemp - minTemp) / colors.length;

  const axisScale = d3.scale.linear()
    .domain([minTemp, maxTemp])
    .range([0, keyWidth]);

  const xScale = d3.scale.ordinal()
    .domain(d3.range(colors.length))
    .rangeBands([0, keyWidth]);

  const xAxis = d3.svg.axis()
    .scale(axisScale)
    .tickFormat(d3.format('.2f'))
    // .tickValues([minTemp, (tempSpread / 4) + minTemp, (tempSpread / 2) + minTemp,
    //   (tempSpread * 0.75) + minTemp, maxTemp])
    .tickValues([minTemp, minTemp + (tempSpread * 1), minTemp + (tempSpread * 2),
      minTemp + (tempSpread * 3), minTemp + (tempSpread * 4), minTemp + (tempSpread * 5),
      minTemp + (tempSpread * 6), minTemp + (tempSpread * 7), minTemp + (tempSpread * 8),
      minTemp + (tempSpread * 9), minTemp + (tempSpread * 10), maxTemp])
    .orient('bottom');

  const svg = d3.select('#root')
    .append('div')
      .attr('class', 'key-container')
    .append('svg')
      .attr('class', 'key')
      .attr('width', keyWidth + (keyPadding * 2))
      .attr('height', keyHeight + (keyPadding * 2))
    .append('g')
      .attr('transform',
      `translate(${keyPadding}, ${keyPadding})`);

  svg.selectAll('rect')
    .data(colors)
    .enter().append('rect')
    .attr('x', (d, i) => xScale(i))
    .attr('y', 0)
    .attr('width', xScale.rangeBand())
    .attr('height', keyHeight - keyPadding)
    .style('fill', (d, i) => colors[i]);

  // append x axis & label
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${keyHeight - keyPadding})`)
    .call(xAxis)
  .append('text')
    .attr('class', 'label')
    .attr('x', keyWidth / 2)
    .attr('y', keyPadding - 5)
    .text('Temperature Range (\u00B0C)');
};

// use remote file on codepen
// d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', (error, data) => {
d3.json('../temp/global-temperature.json', (error, data) => {
  // if (error) {
  //   console.log(error);
  // }
  // console.log(data);
  buildChart(data.monthlyVariance, data.baseTemperature);
  buildKey(data.monthlyVariance, data.baseTemperature);
});
