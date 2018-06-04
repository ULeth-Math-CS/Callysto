var colors = ["red", "green", "blue", "gray", "yellow", "teal", "aqua", "purple", "silver", "lime"];
// Variables for drag_handler
var startX = 0;
var startY = 0;
var draggedCircleIndex = 0;
var draggedCircleColors = [];

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
        d3transtionBack(drivingData, circle, draggedCircleIndex);
      }
      else {
        var startingIndex = numberOfCircles*2;
        for(var i = startingIndex; i < drivingData.length; ++i) {
          if(endX <= drivingData[i].x && Math.abs(drivingData[i].x-endX) < (distanceBetweenCircles/2)) {
            if(isOccupied(drivingData[i])) {
              d3transtionBack(drivingData, circle, draggedCircleIndex);
            }

            else {
              d3transitionTo(drivingData, circle, draggedCircleIndex, i, checkForEnd);
            }
            break;
          }

          else if(endX > drivingData[i].x && Math.abs(drivingData[i].x-endX) < (distanceBetweenCircles/2)) {
            if(isOccupied(drivingData[i])) {
              d3transtionBack(drivingData, circle, draggedCircleIndex);
            }

            else {
              d3transitionTo(drivingData, circle, draggedCircleIndex, i, checkForEnd);
            }
            break;
          }

          else if(endX > drivingData[i].x && i == drivingData.length-1) {
            if(isOccupied(drivingData[i])) {
              d3transtionBack(drivingData, circle, draggedCircleIndex);
            }

            else {
              d3transitionTo(drivingData, circle, draggedCircleIndex, i, checkForEnd);
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
createCircles(drivingData, svg, drag_handler);

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
    if(this.value > numberOfCircles) {
      addCircle();
    }

    else {
      removeCircle();
    }
}


function createCircles(data, svg, dragFunc) {
    var circles = svg.selectAll("circle")
      .data(data)
        .enter()
          .append("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", radius)
            .attr("fill", function(d) { return d.color;})
            .style("stroke", function(d) { return d.border; });

  var draggableCircles = svg.selectAll("circle").filter(function(d, i) { return i % 2 == 1 && i < numberOfCircles*2; }).call(dragFunc);

    // d3.v4
    // draggableCircles = svg.selectAll("circle").filter(function(d, i) { return i % 2 == 1 && i < numberOfCircles*2; });
    //drag_handler(draggableCircles);
}

function updateCircles(data, d3obj, nCircles, subset) {
  var circles = d3obj.selectAll("circle")
    .data(data)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("fill", function(d) { return d.color; })
        .style("stroke", function(d) { return d.border; });

  console.log(data);
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

  var draggedCircles = [];
  if(numberOfCircles*3 < drivingData.length)
     draggedCircles = drivingData.slice(numberOfCircles*3, drivingData.length);

  console.log(draggedCircles);

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

  ++numberOfCircles;
  var index = indexOfLastFull;
  for(var k = 0; k < numberOfCircles; ++k, ++index) {
    if(index == drivingData.length) {
      drivingData.push({ x:(k*distanceBetweenCircles) + startingXNode, y: circleLineHeight + 50, color: "none", border: "black"});
    }

    else {
      drivingData[index] = { x: (k*distanceBetweenCircles) + startingXNode, y: circleLineHeight + 50, color: "none", border: "black"};
    }
  }

  for(var i = 0; i < draggedCircles.length; ++i) {
    drivingData.push(draggedCircles[i]);
  }

  console.log(drivingData);
  var answerText = d3.select("#circle1-answer");
  updateCircles(drivingData, svg, numberOfCircles);
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
  svg.selectAll("circle").filter(function(d, i) {
    if(i >= numberOfCircles*3) {
      console.log(i);
    }
    return i >= numberOfCircles*3;
  })
  .on("click", function(d) { destroyElement(drivingData, svg, d, numberOfCircles); });
}

function addDraggedCircle(data, d3obj, nCircles, subset) {
  updateCircles(data, d3obj, nCircles, subset);
  var circles = d3obj.selectAll("circle")
  .data(data)
    .enter()
      .append("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", radius)
        .attr("fill", function(d) { return d.color; })
        .style("stroke", function(d) { return d.border});

  var draggableIndex = 0;
  if(subset) {
    draggableIndex = nCircles*2+subset;
  }

  else {
    draggableIndex = nCircles*3;
  }

  //svg.selectAll("circle").filter(function(d,i) { return i % 2 == 1 && i < draggableIndex; }).call(drag_handler);
  d3obj.selectAll("circle").filter(function(d, i) {
    if(i >= draggableIndex) {
      console.log(i);
    }
    return i >= draggableIndex;
  })
  .on("click", function(d) { destroyElement(data, d3obj, d, nCircles, subset); });
}

function removeCircle() {
  removeDraggedCircles();
  var indexToRemove = (numberOfCircles * 2) - 2;
  var circlesToRemove = 2;
  console.log(indexToRemove);
  for(var i = 0; i < circlesToRemove; ++i) {
    drivingData.splice(indexToRemove, 1);
  }

  --numberOfCircles;

  drivingData.splice(numberOfCircles*3, 1);


  var answerText = d3.select("#circle1-answer");
  updateCircles(drivingData, svg, numberOfCircles);
  svg.selectAll("circle").data(drivingData).exit().remove();
}

function removeDraggedCircles() {
  var indexToRemove = numberOfCircles * 3;
  var colorToRemove = drivingData[(numberOfCircles*2) - 1].color;
  if(indexToRemove < drivingData.length) {
    var i;
    console.log(colorToRemove);
    for(i = indexToRemove; i < drivingData.length; ++i) {
      if(drivingData[i].color == colorToRemove) {
          drivingData.splice(i, 1);
      }
    }
  }

  else {
    console.log("Nothing to remove!");
  }
}

function isOccupied(obj, data, nCircles, subset) {
  var draggedCircleIndex = 0;
  if(subset) {
    draggedCircleIndex = nCircles*2+subset;
  }

  else {
    draggedCircleIndex = nCircles*3;
  }
  if(draggedCircleIndex < data.length) {
      for(var i = draggedCircleIndex; i < data.length; ++i) {
        if(obj.x == data[i].x && obj.y == data[i].y) {
          return true;
        }
      }
  }

  return false;
}

function d3transtionBack(data, obj, objIndex) {
  obj.transition()
   .attr("cx", function() { return data[objIndex].x; })
   .attr("cy", function() { return data[objIndex].y; });
}

function d3transitionTo(data, obj, objIndex, toIndex, callback) {
  obj.transition()
    .attr("cx", function() { return data[objIndex].x = data[toIndex].x; })
    .attr("cy", function() { return data[objIndex].y = data[toIndex].y; })
    .each("end", function(d, i) { 
      console.log(objIndex);
      moveTo(data, objIndex, objIndex-1);
      createCopy(data, obj, data[toIndex].x, data[toIndex].y);
      callback();
    });
}

function areFull(data, nCircles, subset) {
  var draggableIndex;
  var fullThreshold;
  if(subset) {
    draggableIndex = (nCircles*2) + subset;
    fullThreshold = subset;
  }

  else {
    draggableIndex = nCircles*3;
    fullThreshold = nCircles;
  }


  if(draggableIndex < data.length) {
    if((data.length - draggableIndex) == fullThreshold) {
      return true;
    }
  }

  return false;
}

function isEmpty(data, nCircles, subset) {
  var draggableIndex = 0;
  if(subset) {
    draggableIndex = nCircles*2 + subset;
  }
  else {
    draggableIndex = nCircles*3;
  }
  if(draggableIndex < drivingData.length) 
    return false;

  return true;
}

function isPermutation(data, nCircles, subset) {
  var i;
  if(subset) {
    i = (nCircles*2) + subset
  }
  else {
    i = nCircles*3;
  }

  for(; i < data.length-1; ++i) {
    for(var j = i+1; j < data.length; ++j) {
      if(data[i].color == data[j].color) {
        return false;
      }
    }
  }

  return true;
}

function moveTo(data, objIndex, toIndex) {
  data[objIndex].x = data[toIndex].x;
  data[objIndex].y = data[toIndex].y;
}

function resetCircles() {
  drivingData.splice(numberOfCircles*3, numberOfCircles);
  svg.selectAll("circle").data(drivingData).exit().remove();
  d3.select("#reset-circles").style("display", "none");
  d3.select("#circles1-answer").text("")
                              .style("background-color", "transparent");
  slider.disabled = false;
  updateCircles(drivingData, svg, numberOfCircles);
  clearTimeout(answeringTimeout);
}

function createCopy(data, obj, atX, atY) {
  data.push({x: atX, y: atY, color: obj.data()[0].color, border: "none"});
}

function destroyElement(data, d3obj, obj, nCircles, subset) {
  var draggableIndex = 0;
  if(subset) {
    draggableIndex = nCircles*2+subset;
  }

  else {
    draggableIndex = nCircles*3;
  }
  for(var i = draggableIndex; i < data.length; ++i) {
    if(obj.x == data[i].x && obj.y == data[i].y) {
      data.splice(i, 1);
      break;
    }
  }

  updateCircles(data, d3obj, nCircles, subset);
  d3obj.selectAll("circle").data(data).exit().remove();
}

function checkForEnd() {
  addDraggedCircle(drivingData, svg, numberOfCircles);
  var answer = d3.select("#circles1-answer");
  if(areFull(drivingData, numberOfCircles)) {
    var resetButton = d3.select("#reset-circles").style("display", "block");
    if(isPermutation(drivingData, numberOfCircles)) {
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

      if(!isEmpty(drivingData, numberOfCircles)){ 
        answer.text("Permutting...");
        answer.style("background-color", "transparent");
        answeringTimeout = setTimeout(function() {
          answer.style("background-color", "red");
          answer.text("Incorrect.");
        }, 5000);
      }

    else {
      answer.text("");
      answer.style("background-color", "transparent");
    }
  }
}