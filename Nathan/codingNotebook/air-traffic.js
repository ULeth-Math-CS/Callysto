require.config({
  paths: {
    d3: 'https://d3js.org/d3.v5.min'
  }
})
require(['d3'], function(d3) {
  // draw map
  d3.select("body")
    .append("svg")
      .classed("map-container")

  
})
