d3.json("./data/wiki_data.json", function(data) {
      let index = 1;
      let wikiTable = d3.select("#wikitable");
      let headings = [ "Rank", "Country", "Ecological Footprint", "Biocapacity", "Biocapacity deficit or reserve", "Population (millions)", "Total Biocapacity"];
      wikiTable.append("thead").append("tr")
        .selectAll("th")
          .data(headings)
            .enter()
              .append("th")
                .text(function(d) { return d; } )
                .style("text-align", "center")
                .classed("rendered_html", false);


      let jsonArray = [];
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
