var jsonArray = [];

d3.json("./data/wiki_data.json", function(data) {
      let index = 1;
      let wikiTable = d3.select("#wikitable").style("width", "100%");
      let headings = [ "Rank", "Country", "Ecological Footprint", "Biocapacity", "Biocapacity deficit or reserve", "Population (millions)", "Total Biocapacity"];
      wikiTable.append("thead").append("tr")
        .selectAll("th")
          .data(headings)
            .enter()
              .append("th")
                .text(function(d) { return d; } )
                .style("text-align", "center")
                .classed("rendered_html", false);


      let numberOfEntriesToDisplay = 20;
      let keyLength = Object.keys(data).length;
      for(let i = 1; i <= keyLength; ++i) {
        let objectKeyLength = Object.keys(data[i.toString()]).length;
        jsonArray.push([]);
        jsonArray[i-1].push(data[i.toString()].Rank);
        jsonArray[i-1].push(data[i.toString()].Country);
        jsonArray[i-1].push(data[i.toString()]["Ecological Footprint"]);
        jsonArray[i-1].push(data[i.toString()].Biocapacity);
        jsonArray[i-1].push(data[i.toString()]["Biocapacity deficit or reserve"]);
        jsonArray[i-1].push(data[i.toString()]["Population (millions)"]);
        jsonArray[i-1].push(data[i.toString()]["Total Biocapacity"]);
      }

      wikiTable.append("tbody").selectAll("tr")
        .data(jsonArray)
          .enter()
            .append("tr")
              .selectAll("td")
                 .data(function(d) { return d; })
                  .enter()
                     .append("td")
                        .text(function(d) { return d; })
                        .style("text-align", "center")
                        .classed("rendered_html", false);

});

function filter(str) {
   if(typeof(str) != "string") {
       console.error("filter must get a string argument that is either \"top\", \"bottom\", or \"all\"");
       return;
   }
   let top = 20;
   let bottom = 20;
   
   let wikiTable = d3.select("#wikitable ");
   let jsonArraySubset = [];
   if(str === "top") {
       jsonArraySubset = jsonArray.slice(0, top);
       wikiTable.select("tbody").selectAll("tr")
                                   .data(jsonArraySubset)
                                     .exit()
                                       .remove();
       
       wikiTable.select("tbody").selectAll("tr").selectAll("td").data(function(d) { return d; } ).exit().remove();
       
       wikiTable.select("tbody").selectAll("tr")
        .data(jsonArraySubset)
              .selectAll("td")
                 .data(function(d) { return d; })
                        .text(function(d) { return d; })
                        .style("text-align", "center")
                        .classed("rendered_html", false);
       
       d3.selectAll(".selected").classed("selected", false);
       d3.select("#top-btn").classed("selected", true);
   }
    
    else if(str === "bottom") {
       jsonArraySubset = jsonArray.slice(jsonArray.length - bottom);
       wikiTable.select("tbody").selectAll("tr")
                                   .data(jsonArraySubset)
                                     .exit()
                                       .remove();
       
       wikiTable.select("tbody").selectAll("tr").selectAll("td").data(function(d) { return d; } ).exit().remove();
       
       wikiTable.select("tbody").selectAll("tr")
        .data(jsonArraySubset)
              .selectAll("td")
                 .data(function(d) { return d; })
                        .text(function(d) { return d; })
                        .style("text-align", "center")
                        .classed("rendered_html", false);
        
       d3.selectAll(".selected").classed("selected", false);
       d3.select("#bottom-btn").classed("selected", true);
    }
    
    else if(str === "all") {
        wikiTable.select("tbody").selectAll("tr")
            .data(jsonArray)
              .selectAll("td")
                 .data(function(d) { return d; })
                        .text(function(d) { return d; })
                        .style("text-align", "center")
                        .classed("rendered_html", false);
        
        wikiTable.select("tbody").selectAll("tr")
            .data(jsonArray)
              .enter()
                .append("tr")
                  .selectAll("td")
                     .data(function(d) { return d; })
                        .enter()
                            .append("td")
                            .text(function(d) { return d; })
                            .style("text-align", "center")
                            .classed("rendered_html", false);
        
       d3.selectAll(".selected").classed("selected", false);
       d3.select("#all-btn").classed("selected", true);
        
    }
}
