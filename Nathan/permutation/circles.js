var colors = ["red", "green", "blue", "gray", "yellow", "teal", "aqua", "purple", "silver", "lime"];
var drag_handler = d3.drag()
  .on("drag", function (d) {
    d3.select(this)
      .attr("cx", d3.event.x)
      .attr("cy", d3.event.y);
  })
  .on("start", function (d) {
    startX = d3.event.x;
    startY = d3.event.y;
    draggedCircleIndex = 0;
    for (var i = 0; i < drivingData.length; ++i) {
      if (startX == drivingData[i].x) {
        draggedCircleIndex = i;
        break;
      }
    }
  })
  .on("end", function (d) {
    var circle = d3.select(this);
    var endX = Number(circle.attr("cx"));

    var inserted = false;
    if (Math.abs(startX - endX) < distanceBetweenCircles) {
      d3.select(this).transition()
        .attr("cx", function () {
          return drivingData[draggedCircleIndex].x;
        })
        .attr("cy", circleLineHeight);
    }

    else if (startX > endX) {
      var left = true;
      var index = draggedCircleIndex - 1;
      while (index >= 0 && !inserted) {
        if (endX < drivingData[index].x && (drivingData[index].x - endX) < distanceBetweenCircles) {
          // transition to the right
          experiment_full_svg.selectAll("circle")
            .filter(function (d, i) {
              return i >= index && i < draggedCircleIndex;
            })
            .transition()
            .attr("cx", function () {
              return Number(d3.select(this).attr("cx")) + distanceBetweenCircles;
            });

          d3.select(this).transition()
            .attr("cx", function () {
              return drivingData[index].x;
            })
            .attr("cy", function() {
                return drivingData[index].y;
            })
            .on('end', function (d) { rearrangeData(draggedCircleIndex, index, 0); });

          inserted = true;
        }
        
        if(!inserted)
          --index;
      }
    }

    else if (endX > startX) {
      var left = false;
      var index = 0;
      while (!inserted && index < drivingData.length) {
        if (endX > drivingData[index].x && Math.abs(drivingData[index].x - endX) < distanceBetweenCircles) {
          console.log("Going right!");
          experiment_full_svg.selectAll("circle")
            .filter(function (d, i) {
              return i <= index && i > draggedCircleIndex;
            })
            .transition()
            .attr("cx", function () {
              return Number(d3.select(this).attr("cx")) - distanceBetweenCircles;
            });

          d3.select(this).transition()
            .attr("cx", function () {
              return drivingData[index].x;
            })
            .attr("cy", function() {
                return drivingData[index].y;
            })
            .on('end', function(d) { rearrangeData(draggedCircleIndex, index, 1)})

          inserted = true;
        }
        
        if(!inserted)
          ++index;
      }
    }
  })
var radius = 20;
var distanceBetweenCircles = 50;
var startingXNode = 40;
var circleLineHeight = 150;
var slider = document.getElementById("perm-range-slider");
var output = document.getElementById("slider-output");
var drivingData = [];
for (var i = 0; i < slider.value; ++i) {
  var data = { x: (i * distanceBetweenCircles) + startingXNode, y: (circleLineHeight - 50), border: "none", color: colors[i] };
  drivingData.push( data );
}

// for (var i = 0; i < slider.value; ++i) {
//     var data = { x: (i * distanceBetweenCircles) + startingXNode, y: (circleLineHeight + 50), border: "black", color: "none" };
//     drivingData.push( data );
//   }

output.innerHTML = slider.value; // Display the default slider value
var numberOfCircles = slider.value;
// Create experiment-full-svg
var experiment_full_svg = d3.select("#experiment-full")
  .append("svg")
  .attr("width", "100%")
  .attr("height", 300)
  .append("g");

var experiment_fill_svg = d3.select("#experiment-fill")
    .append("svg")
    .attr("width", "100%")
    .attr("height", 300)
    .append("g");


// Create original circles
createCircles(drivingData);

// Variables for drag_handler
var startX = 0;
var startY = 0;
var draggedCircleIndex = 0;

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;
  if(this.value > numberOfCircles) {
    addCircle();
    ++numberOfCircles;
  }

  else {
    removeCircle();
    --numberOfCircles;
  }
}


function createCircles(d) {
    var circles = experiment_full_svg.selectAll("circle")
        .data(d)
            .enter()
                .append("circle")
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function(d) {
                        return d.y;
                    })
                    .attr("r", radius)
                    .attr("fill", function (d) {
                        return d.color;
                    })
                    .style("stroke", function(d) {
                        return d.border;
                    });

  drag_handler(circles);
}



function updateCircles(d) {
  var circles = experiment_full_svg.selectAll("circle")
    .data(d);

  console.log(circles.data());
  circles.attr("cx", function (d) { return d.x; });
  circles.attr("cy", function(d) { return d.y; });
  circles.attr("fill", function (d) { return d.color; });
}

function addCircle() {
  var match;
    var i = 0;
    do {
      match = drivingData.find(function(d) { return d.color == colors[i]; });
      if(!match) {
        var newCircle = { x: (i * distanceBetweenCircles) + startingXNode, y: (circleLineHeight - 50), border: "none", color: colors[i] };
        drivingData.push(newCircle);
      }

      else
        ++i;
    } while(match)

  var circles = experiment_full_svg.selectAll("circle")
    .data(drivingData)
      .enter()
        .append("circle")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", radius)
          .attr("fill", function(d) { return d.color; });

  drag_handler(circles);

}

function removeCircle() {
  drivingData.pop();
  experiment_full_svg.selectAll("circle")
      .data(drivingData)
        .exit()
          .remove();
}

function rearrangeData(startingIndex, insertedIndex, direction) {
  console.log("StartingIndex: " + startingIndex + " insertedIndex: " + insertedIndex + " direction: " + direction);

  if (!direction) {
    var originalColor = drivingData[startingIndex].color;
    console.log(originalColor);
    for (var i = startingIndex; i > insertedIndex; --i) {
      console.log("current color: " + drivingData[i].color + " newColor: " + drivingData[i - 1].color);
      drivingData[i].color = drivingData[i - 1].color;
    }

    console.log("current color: " + drivingData[insertedIndex].color + " newColor: " + originalColor);
    drivingData[insertedIndex].color = originalColor;
    console.log(drivingData);
  }

  else {
    var originalStart = drivingData[startingIndex];
    for (var i = startingIndex; i < insertedIndex; ++i) {
      drivingData[i] = drivingData[i + 1];
      drivingData[i].x -= distanceBetweenCircles;
    }

    drivingData[insertedIndex] = originalStart;
    drivingData[insertedIndex].x += distanceBetweenCircles * (insertedIndex - startingIndex);

  }

  updateCircles(drivingData);
}