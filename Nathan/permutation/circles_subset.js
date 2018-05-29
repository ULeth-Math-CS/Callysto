var subset_drag_handler = d3.behavior.drag()
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
      if(startX == drivingSubsetData[i].x && startY == drivingSubsetData[i].y) {
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
        d3transtionBack_subset(circle, draggedCircleIndex);
      }
      else {
        var startingIndex = numberOfCircles*2;
        for(var i = startingIndex; i < drivingSubsetData.length; ++i) {
          if(endX <= drivingSubsetData[i].x && Math.abs(drivingSubsetData[i].x-endX) < (distanceBetweenCircles/2)) {
            if(isOccupied_subset(drivingSubsetData[i])) {
              d3transtionBack_subset(circle, draggedCircleIndex);
            }

            else {
              d3transitionTo_subset(circle, draggedCircleIndex, i);
            }
            break;
          }

          else if(endX > drivingSubsetData[i].x && Math.abs(drivingSubsetData[i].x-endX) < (distanceBetweenCircles/2)) {
            if(isOccupied_subset(drivingSubsetData[i])) {
              d3transtionBack_subset(circle, draggedCircleIndex);
            }

            else {
              d3transitionTo_subset(circle, draggedCircleIndex, i);
            }
            break;
          }

          else if(endX > drivingSubsetData[i].x && i == drivingSubsetData.length-1) {
            if(isOccupied_subset(drivingSubsetData[i])) {
              d3transtionBack_subset(circle, draggedCircleIndex);
            }

            else {
              d3transitionTo_subset(circle, draggedCircleIndex, i);
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
var sliderFull = document.getElementById("perm-fullsubset-range-slider");
var sliderFill = document.getElementById("perm-fillsubset-range-slider");
var outputFull = document.getElementById("slider-full-output");
var outputFill = document.getElementById("slider-fill-output");

console.log(sliderFill.value);
d3.select("#perm-fillsubset-range-slider").attr("max", Number(sliderFull.value)-1);
d3.select("#perm-fullsubset-range-slider").attr("min", Number(sliderFill.value)+1);

var drivingSubsetData = [];
var numberOfFullCircles = Number(sliderFull.value);
var numberOfFillCircles = Number(sliderFill.value);
for(var i = 0; i < numberOfFullCircles; ++i) {
  drivingSubsetData.push({x:(i*distanceBetweenCircles)+startingXNode, y: circleLineHeight-50, color:colors[i], border: "none" });
  drivingSubsetData.push({x:(i*distanceBetweenCircles)+startingXNode, y: circleLineHeight-50, color:colors[i], border: "none" });
}

for(var i = 0; i < numberOfFillCircles; ++i) {
  drivingSubsetData.push({ x: (i*distanceBetweenCircles)+startingXNode, y: circleLineHeight+50, color: "none", border: "black" });
}


console.log(drivingSubsetData);
outputFull.innerHTML = sliderFull.value; // Display the default slider value
outputFill.innerHTML = sliderFill.value;
// Create svg
var subsetSvg = d3.select("#experiment-subset")
  .append("svg")
    .attr("width", "100%")
    .attr("height", 300)
  .append("g");

// Create original circles
createCircles_subset(drivingSubsetData);

// Update the current slider value (each time you drag the slider handle)
sliderFull.oninput = function() {
    outputFull.innerHTML = this.value;
    if(this.value > numberOfFullCircles) {
      addFullCircle();
    }

    else {
      removeFullCircle();
      // Put this in removeCircles!
    }

    d3.select("#perm-fillsubset-range-slider").attr("max", Number(sliderFull.value)-1);
}

sliderFill.oninput = function() {
    outputFill.innerHTML = this.value;
    if(this.value > numberOfFillCircles) {
      addFillCircle();
    }

    else {
      removeFillCircle();
      // Put this in removeCircles!
    }

    d3.select("#perm-fullsubset-range-slider").attr("min", Number(sliderFill.value)+1);
}

function createCircles_subset(d) {
    var circles = subsetSvg.selectAll("circle")
      .data(d)
        .enter()
          .append("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", radius)
            .attr("fill", function(d) { return d.color;})
            .style("stroke", function(d) { return d.border; });

    subsetSvg.selectAll("circle").filter(function(d, i) { return i % 2 == 1 && i < numberOfFullCircles*2; }).call(subset_drag_handler);

    // d3.v4
    // draggableCircles = svg.selectAll("circle").filter(function(d, i) { return i % 2 == 1 && i < numberOfCircles*2; });
    //drag_handler(draggableCircles);
}

function updateCircles_subset() {
    var circles = subsetSvg.selectAll("circle")
        .data(drivingSubsetData)
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("fill", function(d) { return d.color; })
            .style("stroke", function(d) { return d.border; });

    
    
    if(areFull_subset()) {
        console.log("Complete!");
        var answer = d3.select("#circles-subset-answer");
        if(isPermutation_subset()) {
            answer.text("Correct!");
            answer.style("background-color", "green");
        }
        else {
            answer.text("Incorrect.");
            answer.style("background-color", "red");
        }
        slider.disabled = true;
        d3.select("#circles-subset-answer-container").style("display", "block");
    }
}

function addCircle_subset() {
    var match;
    var newColor;
    var i = 0;
    do {
    match = drivingSubsetData.find(function(d) { return d.color == colors[i]});
    if(!match) {
        newColor = colors[i];
    }
    ++i;
    } while(match)

    var indexOfLastFull = (numberOfCircles*2) + 2;
    var indexOfLastCircle = indexOfLastFull + (numberOfCircles+1);
    for(var k = numberOfCircles*2; k < indexOfLastFull; ++k) {
        if(k == drivingSubsetData.length) {
        drivingSubsetData.push({ x: (numberOfCircles*distanceBetweenCircles) + startingXNode, y: circleLineHeight - 50, color: newColor, border: "none"});
        }
        else {
        drivingSubsetData[k] ={ x: (numberOfCircles*distanceBetweenCircles) + startingXNode, y: circleLineHeight - 50, color: newColor, border: "none"};
        }
    }

    var index = indexOfLastFull;
    for(var k = 0; k < numberOfCircles+1; ++k, ++index) {
        if(index == drivingSubsetData.length) {
            drivingSubsetData.push({ x:(k*distanceBetweenCircles) + startingXNode, y: circleLineHeight + 50, color: "none", border: "black"});
        }

        else {
            drivingSubsetData[index] = { x: (k*distanceBetweenCircles) + startingXNode, y: circleLineHeight + 50, color: "none", border: "black"};
        }
    }

    console.log(drivingSubsetData);

    updateCircles_subset();

    ++numberOfCircles;
    var circles = subsetSvg.selectAll("circle")
                .data(drivingSubsetData)
                    .enter()
                    .append("circle")
                        .attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; })
                        .attr("r", radius)
                        .attr("fill", function(d) { return d.color; })
                        .style("stroke", function(d) { return d.border});


    subsetSvg.selectAll("circle").filter(function(d,i) { return i % 2 == 1 && i < numberOfFullCircles*2; }).call(subset_drag_handler);
  // d3.v4
  //var draggableCircles = svg.selectAll("circle").filter(function(d,i) { return i % 2 == 1 && i < numberOfCircles*2; });
  //drag_handler(draggableCircles);
}

function addFullCircle() {
    var match;
    var newColor;
    var i = 0;
    do {
      match = drivingSubsetData.find(function(d) { return d.color == colors[i]});
      if(!match) {
        newColor = colors[i];
      }
      ++i;
    } while(match)
  
    var indexOfLastFull = (numberOfFullCircles*2) + 2;
    for(var k = numberOfFullCircles*2; k < indexOfLastFull; ++k) {
        console.log(drivingSubsetData[k]);
        if(k == drivingSubsetData.length) {
          drivingSubsetData.push({ x: (numberOfFullCircles*distanceBetweenCircles) + startingXNode, y: circleLineHeight - 50, color: newColor, border: "none"});
        }
        else {
          drivingSubsetData[k] = { x: (numberOfFullCircles*distanceBetweenCircles) + startingXNode, y: circleLineHeight - 50, color: newColor, border: "none"};
        }
    }

    var index = indexOfLastFull;
    for(var k = 0; k < numberOfFillCircles; ++k, ++index) {
        if(index == drivingSubsetData.length) {
            drivingSubsetData.push({ x:(k*distanceBetweenCircles) + startingXNode, y: circleLineHeight + 50, color: "none", border: "black"});
        }
    
        else {
            drivingSubsetData[index] = { x: (k*distanceBetweenCircles) + startingXNode, y: circleLineHeight + 50, color: "none", border: "black"};
        }
        console.log(drivingSubsetData[index]);
    }

    updateCircles_subset();

    ++numberOfFullCircles;
    var circles = subsetSvg.selectAll("circle")
                .data(drivingSubsetData)
                    .enter()
                    .append("circle")
                        .attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; })
                        .attr("r", radius)
                        .attr("fill", function(d) { return d.color; })
                        .style("stroke", function(d) { return d.border});


    subsetSvg.selectAll("circle").filter(function(d,i) { return i % 2 == 1 && i < numberOfFullCircles*2; }).call(subset_drag_handler);
}

function addFillCircle() {
    drivingSubsetData.push({ x:(numberOfFillCircles*distanceBetweenCircles) + startingXNode, y: circleLineHeight + 50, color: "none", border: "black"});
    ++numberOfFillCircles;
    var circles = subsetSvg.selectAll("circle")
    .data(drivingSubsetData)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", radius)
            .attr("fill", function(d) { return d.color; })
            .style("stroke", function(d) { return d.border});
}

function removeCircle_subset() {
  var indexToRemove = (numberOfCircles-1) * 2;
  var numberOfCirclesToRemove = 3;
  for(var i = indexToRemove; i < drivingSubsetData.length - numberOfCirclesToRemove; ++i) {
    drivingSubsetData[i] = drivingSubsetData[i+2];
  }

  for(var i = 0; i < numberOfCirclesToRemove; ++i) {
    drivingSubsetData.pop();
  }

  updateCircles_subset();
  subsetSvg.selectAll("circle").data(drivingSubsetData).exit().remove();
}

function removeFullCircle() {
    var indexToRemove = (numberOfFullCircles-1) * 2;
    var numberOfCirclesToRemove = 2;
    for(var i = indexToRemove; i < drivingSubsetData.length - numberOfCirclesToRemove; ++i) {
      drivingSubsetData[i] = drivingSubsetData[i+2];
    }
  
    for(var i = 0; i < numberOfCirclesToRemove; ++i) {
      drivingSubsetData.pop();
    }
  
    console.log(drivingSubsetData);

    updateCircles_subset();
    subsetSvg.selectAll("circle").data(drivingSubsetData).exit().remove();
    --numberOfFullCircles;
}

function removeFillCircle() {
    drivingSubsetData.pop();
    --numberOfFillCircles;
    updateCircles_subset();
    subsetSvg.selectAll("circle").data(drivingSubsetData).exit().remove();
}

function isOccupied_subset(d) {
    for(var i = 1; i < numberOfFullCircles*2; i = i + 2) {
      if(d.x == drivingSubsetData[i].x && d.y == drivingSubsetData[i].y) {
        console.log("returning true");
        return true;
      }
    }
    return false;
  }
  
  function d3transtionBack_subset(obj, objIndex) {
    obj.transition()
     .attr("cx", function() { return drivingSubsetData[objIndex].x; })
     .attr("cy", function() { return drivingSubsetData[objIndex].y; });
  }
  
  function d3transitionTo_subset(obj, objIndex, toIndex) {
    obj.transition()
      .attr("cx", function() { return drivingSubsetData[objIndex].x = drivingSubsetData[toIndex].x; })
      .attr("cy", function() { return drivingSubsetData[objIndex].y = drivingSubsetData[toIndex].y; })
      .each("end", function(d, i) { 
        console.log(objIndex);
        updateCircles_subset(); 
      });
  }
  
  function areFull_subset() {
    var count = 0;
    for(var i = 1; i < numberOfFullCircles*2; i = i + 2) {
      if(drivingSubsetData[i].y > circleLineHeight) {
        ++count;
        if(count == numberOfFillCircles)
            return true;
      }
    }
  
    return false;
  }
  
  function isPermutation_subset() {
    for(var i = 0; i < numberOfFullCircles*2; i=i+2) {
      if(drivingSubsetData[i].x != drivingSubsetData[i+1].x) {
        return true;
      }
    }
  
    return false;
  }
  
  function resetCircles_subset() {
    for(var i = 1; i < numberOfFullCircles*2; i = i + 2) {
      drivingSubsetData[i].x = drivingSubsetData[i-1].x;
      drivingSubsetData[i].y = drivingSubsetData[i-1].y;
    }
  
    d3.select("#circles1-answer-container").style("display", "none");
    slider.disabled = false;
    updateCircles_subset();
  }