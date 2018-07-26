function check_binomial_answers() {
    let answers = [];
    d3.json("data/binomial-coefficient-answers.json", function(data) {
        let jsonKeyLength = Object.keys(data).length;
        for(let i = 0; i < jsonKeyLength; ++i) {
            answers.push(data[(i+1).toString()]);
        }
        
        let correctIndexes = [];
        let correctAnswers = d3.select("#binomial-co-questions-container").selectAll("input[type=text]")
            .filter(function(d, i) {
                if(this.value == answers[i]) {
                    correctIndexes.push(i);
                    return true;   
                }
            });
        
        d3.select(".binomial-co-question-feedback")
                    .filter(function(d, i) {
                          if(correctIndexes.includes(i)) {
                              let correctIndex = correctAnswers.indexOf(i);
                              correctAnswers[0][correctIndex].style.display = "none";
                              return true;
                          }
                     })
                     .classed("correct", true)
                     .classed("incorrect", false)
                     .classed("hidden", false)
                     .text("Correct!");
    });
} 