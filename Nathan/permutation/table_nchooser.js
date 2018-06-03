var answers = [];
d3.json("./pchoosenData.json", function(data) {
    for(var i = 0; i < data.length; ++i) {
        answers.push(data[i].answer);
    }
    columnNames = [ "available", "selected" ];
    function tabulate(data, columns) {
        var table = d3.select("#permutation-table");
        var thead = table.append("thead");
        var tbody = table.append("tbody");
        thead.append("tr")
            .selectAll("th")
                .data(columns)
                    .enter()
                        .append("th")
                            .text(function(d) { return d; })
        
        var rows = tbody.selectAll("tr")
            .data(data)
                .enter()
                    .append("tr");

        var cells = rows.selectAll('td')
            .data(function(row) {
                return columnNames.map(function(column) {
                    return {column: column, value: row[column] };
                })
            }).enter()
            .append("td")
                .text(function(d) { return d.value; });

        rows.append("td")
                .append("input")
                .attr("class", "table-answers")
                    .style("width", "100%");

        rows.append("td")
                .classed("table-feedback", true)
                .classed("hidden", true);
                


        return table;
    }

    tabulate(data, ['Number Of Circles', 'Number Of Slots', 'Number Of Ways To Rearrange']);
})

function showFeedback() {
    var feebackCells = d3.selectAll(".table-feedback")
        .style("display", "block");
    console.log(feebackCells);
    var answerCells = d3.selectAll(".table-answers");
    for(var i = 0; i < answers.length; ++i) {
        var num = Number(answerCells[0][i].value);
        console.log(num + " " + answers[i]);
        if(num == answers[i]) {
            console.log("Correct!");
            

        }
    }
}