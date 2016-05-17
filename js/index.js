/* global d3 */

const margin = { top: 30, right: 20, bottom: 20, left: 30 };

const width = 1200 - margin.left - margin.right;
const height = 900 - margin.top - margin.bottom;

const svg = d3.select('#root')
  .append('svg')
    .attr('class', 'chart')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// use remote file on codepen
// d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', (error, data) => {
d3.json('../temp/global-temperature.json', (error, data) => {
  if (error) {
    console.log(error);
  }
  console.log(data);
});
