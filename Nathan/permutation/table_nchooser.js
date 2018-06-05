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
                .classed("table-answers", true)
                    .style("width", "100%");

        rows.append("td")
                .classed("table-feedback", true)
                .classed("hidden", true);

        rows.append("td")
            .classed("table-solution", true)
            .classed("hidden", true);

        return table;
    }

    tabulate(data, ['Number Of Circles', 'Number Of Slots', 'Number Of Ways To Rearrange']);
})

function showFeedback() {
    var correctIndexes = [];

    var correctAnswers = d3.selectAll(".table-answers")
        .filter(function(d, i) {
            if(checkAnswer(this, i)) {
                correctIndexes.push(i);
                return true;
            }
        });
    
    var correctFeedback = d3.selectAll(".table-feedback")
        .filter(function(d, i) {
            for(var j = 0; j < correctIndexes.length; ++j) {
                if(i == correctIndexes[j]) {
                    return true;
                }
            }
        })
        .classed("correct", true)
        .classed("hidden", false)
        .text("Correct!");

        var incorrectFeedback = d3.selectAll(".table-feedback")
        .filter(function(d, i) {
            for(var j = 0; j < correctIndexes.length; ++j) {
                if(i != correctIndexes[j]) {
                    return true;
                }
            }
        })
        .classed("incorrect", true)
        .classed("hidden", false)
        .text("Incorrect!");

        d3.select("show-solutions-button").classed("hidden", false);
}

function checkAnswer(obj, i, indexes) {
    return obj.value == answers[i];
}

function showTableSolution() {
    d3.json("pchoosenData.json", function(data) {
        d3.selectAll(".table-solution")
            .classed("hidden", false)
                .data(data)
                    .append("p")
                        .text(function(d) {
                            var numerator = d.available.toString();
                            var denominator = (d.available - d.selected).toString();
                            for(var i = d.available-1; i >= 1; --i) {
                                numerator += " * " + i;
                            }

                            for(var i = (d.available-d.selected)-1; i >= 1; --i) {
                                denominator += " * " + i;
                            }
                            return "$$_" + d.available + "P_" + d.selected + " = \\frac{" + d.available + "}{(" + d.available + "-" + d.selected + ")} = \\frac{" + numerator + "}{" + denominator + "} = " + d.answer + "$$";
                        });

        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    });
}