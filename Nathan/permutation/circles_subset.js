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
    for(var i = 1; i < numberOfFullCircles*2; i=i+2) {
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
        d3transtionBack(drivingSubsetData, circle, draggedCircleIndex);
      }
      else {
        var startingIndex = numberOfCircles*2;
        for(var i = startingIndex; i < drivingSubsetData.length; ++i) {
          if(endX <= drivingSubsetData[i].x && Math.abs(drivingSubsetData[i].x-endX) < (distanceBetweenCircles/2)) {
            if(isOccupied(drivingSubsetData[i], drivingSubsetData, numberOfFullCircles, numberOfFillCircles)) {
              d3transtionBack(drivingSubsetData, circle, draggedCircleIndex);
            }

            else {
              d3transitionTo(drivingSubsetData, circle, draggedCircleIndex, i, checkForSubsetEnd);
            }
            break;
          }

          else if(endX > drivingSubsetData[i].x && Math.abs(drivingSubsetData[i].x-endX) < (distanceBetweenCircles/2)) {
            if(isOccupied(drivingSubsetData[i], drivingSubsetData, numberOfFullCircles, numberOfFillCircles)) {
              d3transtionBack(drivingSubsetData, circle, draggedCircleIndex);
            }

            else {
              d3transitionTo(drivingSubsetData, circle, draggedCircleIndex, i, checkForSubsetEnd)
            }
            break;
          }

          else if(endX > drivingSubsetData[i].x && i == drivingSubsetData.length-1) {
            if(isOccupied(drivingSubsetData[i], drivingSubsetData, numberOfFullCircles, numberOfFillCircles)) {
              d3transtionBack(drivingSubsetData, circle, draggedCircleIndex);
            }

            else {
              d3transitionTo(drivingSubsetData, circle, draggedCircleIndex, i, checkForSubsetEnd)
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
var permutedSetsTableBody_subset = d3.select("#correct-subset-permutations-table").append("tbody");
var subsetAnsweringTimeout;

console.log(sliderFill.value);
d3.select("#perm-fillsubset-range-slider").attr("max", Number(sliderFull.value)-1);
d3.select("#perm-fullsubset-range-slider").attr("min", Number(sliderFill.value)+1);

var drivingSubsetData = [];
var draggedCircles_subset = [];
var permutedSets_subset = [];
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
createCircles(drivingSubsetData, subsetSvg, subset_drag_handler);

// Update the current slider value (each time you drag the slider handle)
sliderFull.oninput = function() {
    outputFull.innerHTML = this.value;
    if(this.value > numberOfFullCircles) {
      addFullCircle();
    }

    else {
      removeFullCircle();
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
  
    var draggedCircles = [];
    var draggedCircleIndex = (numberOfFullCircles*2)+numberOfFillCircles;
    console.log(draggedCircleIndex);
    if(draggedCircleIndex < drivingSubsetData.length)
       draggedCircles = drivingSubsetData.slice(draggedCircleIndex, drivingSubsetData.length);

    var indexOfLastFull = (numberOfFullCircles*2) + 2;
    for(var k = numberOfFullCircles*2; k < indexOfLastFull; ++k) {
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
    
    for(var i = 0; i < draggedCircles.length; ++i) {
      drivingSubsetData.push(draggedCircles[i]);
    }

    updateCircles(drivingSubsetData, subsetSvg, numberOfFullCircles, numberOfFillCircles);

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
    subsetSvg.selectAll("circle").filter(function(d, i) {
      if(i >= numberOfFullCircles*2+numberOfFillCircles) {
        console.log(i);
      }
      return i >= numberOfFullCircles*2+numberOfFillCircles;
    })
    .on("click", function(d) { destroyElement(drivingSubsetData, subsetSvg, d, numberOfFullCircles, numberOfFillCircles); });
}

function addFillCircle() {
    var draggedCircleIndex = numberOfCircles*2+numberOfFillCircles;
    var draggedCircles = drivingSubsetData.slice(draggedCircleIndex, drivingSubsetData.length);
    if(draggedCircles.length == 0) {
      drivingSubsetData.push({ x:(numberOfFillCircles*distanceBetweenCircles) + startingXNode, y: circleLineHeight + 50, color: "none", border: "black"});
    }
    else {
      drivingSubsetData[draggedCircleIndex++] =  { x:(numberOfFillCircles*distanceBetweenCircles) + startingXNode, y: circleLineHeight + 50, color: "none", border: "black"};
      for(var i = 0; i < draggedCircles.length; ++i) {
        if(i == drivingSubsetData.length) {
          drivingSubsetData.push(draggedCircles[i])
        }
        else {
          drivingSubsetData[draggedCircleIndex++] = draggedCircles[i];
        }
      }
    }
    ++numberOfFillCircles;
    updateCircles(drivingSubsetData, subsetSvg, numberOfFullCircles, numberOfFillCircles);
    var circles = subsetSvg.selectAll("circle")
      .data(drivingSubsetData)
          .enter()
          .append("circle")
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              .attr("r", radius)
              .attr("fill", function(d) { return d.color; })
              .style("stroke", function(d) { return d.border});

    subsetSvg.selectAll("circle").filter(function(d, i) {
      if(i >= numberOfFullCircles*2+numberOfFillCircles) {
        console.log(i);
      }
      return i >= numberOfFullCircles*2+numberOfFillCircles;
    })
    .on("click", function(d) { destroyElement(drivingSubsetData, subsetSvg, d, numberOfFullCircles, numberOfFillCircles); });
}

function removeFullCircle() {
    var indexToRemove = (numberOfFullCircles*2) - 2;
    var numberOfCirclesToRemove = 2;
    var colorToRemove = drivingSubsetData[indexToRemove].color;

    drivingSubsetData.splice(indexToRemove, 2);
    console.log(drivingSubsetData);
    --numberOfFullCircles;
    draggedCircleIndex = numberOfFullCircles*2+numberOfFillCircles;
    console.log(draggedCircleIndex);
    if(draggedCircleIndex < drivingSubsetData.length) {
      for(var i = draggedCircleIndex; i < drivingSubsetData.length; ++i) {
        if(drivingSubsetData[i].color == colorToRemove) {
          drivingSubsetData.splice(i--, 1);
        }
      }
    }

    subsetSvg.selectAll("circle").data(drivingSubsetData).exit().remove();
    updateCircles(drivingSubsetData, subsetSvg, numberOfFullCircles, numberOfFillCircles);
}

function removeFillCircle() {
    var indexToRemove = (numberOfFullCircles*2+numberOfFillCircles) - 1;
    for(var i = numberOfFullCircles*2+numberOfFillCircles; i < drivingSubsetData.length; ++i) {
        if(drivingSubsetData[indexToRemove].x == drivingSubsetData[i].x && drivingSubsetData[indexToRemove].y == drivingSubsetData[i].y) {
            drivingSubsetData.splice(i, 1);
            break;
        }
    }
    drivingSubsetData.splice((numberOfFullCircles*2+numberOfFillCircles) - 1, 1);
    updateCircles(drivingSubsetData, subsetSvg, numberOfFullCircles, numberOfFillCircles);
    subsetSvg.selectAll("circle").data(drivingSubsetData).exit().remove();
}

  
function resetCircles_subset() {
  draggedCircleIndex = numberOfFullCircles*2+numberOfFillCircles;
  drivingSubsetData.splice(draggedCircleIndex, numberOfFillCircles);
  subsetSvg.selectAll("circle").data(drivingSubsetData).exit().remove();
  clearTimeout(subsetAnsweringTimeout);

  d3.select("#reset-circles-subset").style("display", "none");
  d3.select("#circles-subset-answer").text("")
                              .style("background-color", "transparent");
  sliderFull.disabled = false;
  sliderFill.disabled = false;
  updateCircles(drivingSubsetData, subsetSvg, numberOfFullCircles, numberOfFillCircles);
}

function checkForSubsetEnd() {
  addDraggedCircle(drivingSubsetData, subsetSvg, numberOfFullCircles, numberOfFillCircles);
  var answer = d3.select("#circles-subset-answer");
  if(areFull(drivingSubsetData, numberOfFullCircles, numberOfFillCircles)) {
    var resetButton = d3.select("#reset-circles-subset").style("display", "block");
    if(isPermutation(drivingSubsetData, numberOfFullCircles, numberOfFillCircles)) {
      if(subsetAnsweringTimeout)
        clearTimeout(subsetAnsweringTimeout);
      
      var set = getSet(drivingSubsetData, numberOfFullCircles, numberOfFillCircles);
      var indexOfSet = setMade(permutedSets_subset, set);
      if(indexOfSet < 0) {
        permutedSets_subset.push(set);
        updateTable(permutedSetsTableBody_subset, permutedSets_subset);

        answer.style("background-color", "green");
        answer.text("Correct.");
      }

      else {
        displaySet(permutedSetsTableBody_subset, permutedSets_subset, indexOfSet)
        answer.text("Permutation has already been made. Try again.");
      }

    }
    else {
      answer.text("Incorrect.");
      answer.style("background-color", "red");
    }

    sliderFull.disabled = true;
    sliderFill.disabled = true;
  }
  

  else {
    if(subsetAnsweringTimeout)
      clearTimeout(subsetAnsweringTimeout);

    if(!isEmpty(drivingSubsetData, numberOfFullCircles, numberOfFillCircles)) {
      answer.text("Permutting...");
      answer.style("background-color", "transparent");
      subsetAnsweringTimeout = setTimeout(function() {
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