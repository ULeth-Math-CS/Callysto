var colors = ["red", "green", "blue", "gray", "yellow", "teal", "aqua", "purple", "silver", "lime"];
// Variables for drag_handler
var startX = 0;
var startY = 0;
var draggedCircleIndex = 0;

var drag_handler = d3.behavior.drag()
  .on("drag", function(d) {
        d3.select(this)
          .attr("cx", d3.event.x  )
          .attr("cy", d3.event.y  );
  })
  .on("dragstart", function(d) {
    startX = d.x
    startY = d.y;
    console.log(startX);
    draggedCircleIndex = 0;
    for(var i = 1; i < numberOfCircles*2; i=i+2) {
      if(startX == drivingData[i].x && startY == drivingData[i].y) {
        draggedCircleIndex = i;
        break;
      }
    }
  })
  .on("dragend", function(d) {
      var circle = d3.select(this);
      var endX = Number(circle.attr("cx"));
      var endY = Number(circle.attr("cy"));
      if(endY < circleLineHeight || (startY > circleLineHeight && endY < circleLineHeight)) {
        d3transtionBack(circle, draggedCircleIndex);
      }
      else {
        var startingIndex = numberOfCircles*2;
        for(var i = startingIndex; i < drivingData.length; ++i) {
          if(endX <= drivingData[i].x && Math.abs(drivingData[i].x-endX) < (distanceBetweenCircles/2)) {
            if(isOccupied(drivingData[i])) {
              d3transtionBack(circle, draggedCircleIndex);
            }

            else {
              d3transitionTo(circle, draggedCircleIndex, i);
            }
            break;
          }

          else if(endX > drivingData[i].x && Math.abs(drivingData[i].x-endX) < (distanceBetweenCircles/2)) {
            if(isOccupied(drivingData[i])) {
              d3transtionBack(circle, draggedCircleIndex);
            }

            else {
              d3transitionTo(circle, draggedCircleIndex, i);
            }
            break;
          }

          else if(endX > drivingData[i].x && i == drivingData.length-1) {
            if(isOccupied(drivingData[i])) {
              d3transtionBack(circle, draggedCircleIndex);
            }

            else {
              d3transitionTo(circle, draggedCircleIndex, i);
            }
            break;
          }
        }
      }

    });
var radius = 20;
var distanceBetweenCircles = 80;
var startingXNode = 40;
var circleLineHeight = 150;
var slider = document.getElementById("perm-range-slider");
var output = document.getElementById("slider-output");
var answeringTimeout;

var drivingData = [];
var numberOfCircles = Number(slider.value);
for(var i = 0; i < numberOfCircles; ++i) {
  drivingData.push({x:(i*distanceBetweenCircles)+startingXNode, y: circleLineHeight-50, color:colors[i], border: "none" });
  drivingData.push({x:(i*distanceBetweenCircles)+startingXNode, y: circleLineHeight-50, color:colors[i], border: "none" });
}

for(var i = 0; i < numberOfCircles; ++i) {
  drivingData.push({ x: (i*distanceBetweenCircles)+startingXNode, y: circleLineHeight+50, color: "none", border: "black" });
}

output.innerHTML = slider.value; // Display the default slider value
// Create svg
var svg = d3.select("#experiment-full")
  .append("svg")
    .attr("width", "80%")
    .attr("height", 300)
  .append("g");

// Create original circles
createCircles(drivingData);

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
    if(this.value > numberOfCircles) {
      addCircle();
    }

    else {
      removeCircle();
      // Put this in removeCircles!
      --numberOfCircles;
    }
}


function createCircles(d) {
    var circles = svg.selectAll("circle")
      .data(d)
        .enter()
          .append("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", radius)
            .attr("fill", function(d) { return d.color;})
            .style("stroke", function(d) { return d.border; });

  var draggableCircles = svg.selectAll("circle").filter(function(d, i) { return i % 2 == 1 && i < numberOfCircles*2; }).call(drag_handler);

    // d3.v4
    // draggableCircles = svg.selectAll("circle").filter(function(d, i) { return i % 2 == 1 && i < numberOfCircles*2; });
    //drag_handler(draggableCircles);
}

function updateCircles() {
  var circles = svg.selectAll("circle")
    .data(drivingData);

  circles.attr("cx", function(d) { return d.x; });
  circles.attr("cy", function(d) { return d.y; });
  circles.attr("fill", function(d) { return d.color; });
  circles.style("stroke", function(d) { return d.border; });
  if(areFull()) {
    var answer = d3.select("#circles1-answer");
    if(isPermutation()) {
      if(answeringTimeout)
        clearTimeout(answeringTimeout);
      
      answer.style("background-color", "green");
      answer.text("Correct.");
    }
    else {
      answer.text("Incorrect.");
      answer.style("background-color", "red");
    }
    slider.disabled = true;
  }

  else {
    if(answeringTimeout)
      clearTimeout(answeringTimeout);
      
    var answer = d3.select("#circles1-answer");
    if(!isEmpty()) { 
      answer.text("Permutting...");
      answer.style("background-color", "transparent");
      answeringTimeout = setTimeout(function() {
          answer.text("Incorrect.");
          answer.style("background-color", "red");
      }, 5000);
    }

    else {
      answer.text("");
      answer.style("background-color", "transparent");
    }
  }
}

function addCircle() {
  var match;
  var newColor;
  var i = 0;
  do {
    match = drivingData.find(function(d) { return d.color == colors[i]});
    if(!match) {
      newColor = colors[i];
    }
    ++i;
  } while(match)

  var indexOfLastFull = (numberOfCircles*2) + 2;
  var indexOfLastCircle = indexOfLastFull + (numberOfCircles+1);
  for(var k = numberOfCircles*2; k < indexOfLastFull; ++k) {
      if(k == drivingData.length) {
        drivingData.push({ x: (numberOfCircles*distanceBetweenCircles) + startingXNode, y: circleLineHeight - 50, color: newColor, border: "none"});
      }
      else {
        drivingData[k] ={ x: (numberOfCircles*distanceBetweenCircles) + startingXNode, y: circleLineHeight - 50, color: newColor, border: "none"};
      }
  }

  var index = indexOfLastFull;
  for(var k = 0; k < numberOfCircles+1; ++k, ++index) {
    if(index == drivingData.length) {
      drivingData.push({ x:(k*distanceBetweenCircles) + startingXNode, y: circleLineHeight + 50, color: "none", border: "black"});
    }

    else {
      drivingData[index] = { x: (k*distanceBetweenCircles) + startingXNode, y: circleLineHeight + 50, color: "none", border: "black"};
    }
  }

  console.log(drivingData);

  updateCircles();

  ++numberOfCircles;
  var circles = svg.selectAll("circle")
                .data(drivingData)
                  .enter()
                    .append("circle")
                      .attr("cx", function(d) { return d.x; })
                      .attr("cy", function(d) { return d.y; })
                      .attr("r", radius)
                      .attr("fill", function(d) { return d.color; })
                      .style("stroke", function(d) { return d.border});


  svg.selectAll("circle").filter(function(d,i) { return i % 2 == 1 && i < numberOfCircles*2; }).call(drag_handler);
  // d3.v4
  //var draggableCircles = svg.selectAll("circle").filter(function(d,i) { return i % 2 == 1 && i < numberOfCircles*2; });
  //drag_handler(draggableCircles);
}

function removeCircle() {
  var indexToRemove = (numberOfCircles-1) * 2;
  var numberOfCirclesToRemove = 3;
  for(var i = indexToRemove; i < drivingData.length - numberOfCirclesToRemove; ++i) {
    drivingData[i] = drivingData[i+2];
  }

  for(var i = 0; i < numberOfCirclesToRemove; ++i) {
    drivingData.pop();
  }

  updateCircles();
  svg.selectAll("circle").data(drivingData).exit().remove();
}

function isOccupied(d) {
  for(var i = 1; i < numberOfCircles*2; i = i + 2) {
    if(d.x == drivingData[i].x && d.y == drivingData[i].y) {
      console.log("returning true");
      return true;
    }
  }
  return false;
}

function d3transtionBack(obj, objIndex) {
  obj.transition()
   .attr("cx", function() { return drivingData[objIndex].x; })
   .attr("cy", function() { return drivingData[objIndex].y; });
}

function d3transitionTo(obj, objIndex, toIndex) {
  obj.transition()
    .attr("cx", function() { return drivingData[objIndex].x = drivingData[toIndex].x; })
    .attr("cy", function() { return drivingData[objIndex].y = drivingData[toIndex].y; })
    .each("end", function(d, i) { 
      console.log(objIndex);
      updateCircles(); 
    });
}

function areFull() {
  for(var i = 1; i < numberOfCircles*2; i = i + 2) {
    if(drivingData[i].y < circleLineHeight) {
      return false;
    }
  }

  return true;
}

function isEmpty() {
  for(var i = 1; i < numberOfCircles*2; i = i + 2) {
    if(drivingData[i].y > circleLineHeight) {
      return false;
    }
  }

  return true;
}

function isPermutation() {
  for(var i = 0; i < numberOfCircles*2; i=i+2) {
    if(drivingData[i].x != drivingData[i+1].x) {
      return true;
    }
  }

  return false;
}

function resetCircles() {
  for(var i = 1; i < numberOfCircles*2; i = i + 2) {
    drivingData[i].x = drivingData[i-1].x;
    drivingData[i].y = drivingData[i-1].y;
  }

  d3.select("#circles1-answer-container").style("display", "none");
  slider.disabled = false;
  updateCircles();
}