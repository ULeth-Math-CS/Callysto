let width = 1280,
    height = 1000;

let canadaSVG = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var scalar = 200;

var projection = d3.geoMercator()
                    .scale([scalar])
                    .center([-45.5017, 73.5673])

projection.translate([ (width / 2) + 100, (height / 2) - 100]);

var geoGenerator = d3.geoPath()
  .projection(projection);

var tooltip = d3.select("body")
                  .append("div")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

d3.json("canada.json", function(error, canada) {
    if(error) return console.error(error);

    canadaSVG.selectAll("path")
      .data(canada.features)
          .enter()
            .append("path")
              .attr("d", geoGenerator);

    data = [{lat: 45.5016998, lon: -73.5672559999999 }, {lat: 46.829853, lon: -71.253028 }];
    canadaSVG.selectAll("circle")
      .data(data)
        .enter()
          .append("circle")
            .attr("cx", function(d) {
              return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
              return projection([d.lon, d.lat])[1];
            })
            .attr("r", 3)
            .style("fill", "orange")
            .on("mouseover", function(d) {
                tooltip.transition()
                          .duration(200)
                          .style("opacity", 0.9);

                tooltip.style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px")
                        .text("Hello");
            })
            .on("mouseout", function(d) {
              tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            })
});
