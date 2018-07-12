let combinationExercises = d3.select("#combination-exercises-container")

d3.json("./data/exercises.json", function(data) {
      let jsonArray = [];
      jsonLength = Object.keys(data).length;
      for(var i = 0; i < jsonLength; ++i) {
          jsonArray.push((i+1).toString() + ") " + data[(i+1).toString()].question);
      }

    
    
      combinationExercises.selectAll("p")
        .data(jsonArray)
            .enter()
                .append("p")
                    .text(function(d) { return d; })
                        .append("br");

    combinationExercises.selectAll("p")
         .insert("input");
});