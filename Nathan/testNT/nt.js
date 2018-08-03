var nt = {
    containers : [],
    register : function(questionsContainer, solutionsContainer, jsonPath, callback, displayExplaination=true) {
        if(typeof(questionsContainer) != "string") {
            console.error("questionsContainer must be the name of the container (div) to put the questions in.");
            return;
        }

        if(typeof(solutionsContainer) != "string") {
            console.error("solutionsContainer must be the name of the container (div) to put the solutions in.");
            return;
        }

        if(typeof(jsonPath) != "string") {
            console.error("jsonPath must be the path to where the json data file is located.");
            return;
        }

        if(typeof(callback) != "function") {
            console.error("callback is not a function. Please provide a callback function.");
            return;
        }

        if(questionsContainer in this.containers) {
            console.warn("container with id " + containerId + " is about to overidden. Did you mean to do that?");
        }

        this.getJson(questionsContainer, jsonPath, callback);
        this.containers[questionsContainer] = 
                                            {
                                                "solutions" : solutionsContainer,
                                                "displayExplaination" : displayExplaination 
                                            }
    },
    registerJson : function(questionsContainer, data, callback) {
        this.containers[questionsContainer].json = data;
        callback();
    },
    getJson : function(questionsContainer, jsonPath, callback) {
        d3.json(jsonPath, function(data) {
            nt.registerJson(questionsContainer, data, callback);
        });
    },
    create_exercises : function(containerId) {
        if(typeof(containerId) != "string") {
            console.error("containerId must be the id of the question container!");
            return;
        }
    
        if(!(containerId in this.containers)) {
            console.error("You have no registered container with containerId: " + containerId);
            return;
        }
    
    
        let questions = [];
        let data = this.containers[containerId].json;
        console.log(data);
        let jsonLength = Object.keys(data).length;
        for(let i = 0; i < jsonLength; ++i) {
            questions.push([]);
            questions[i].push(data[(i+1).toString()].question);
        }

        let rootContainer = d3.select("#" + containerId);

        
        let questionDivs = rootContainer.selectAll("div")
                                            .data(questions)
                                                .enter()
                                                    .append("div")
                                                        .classed("question-container", true);
        questionDivs.selectAll("p")
                        .data(function(d) { return d; })
                            .enter()
                                .append("p")
                                    .text(function(d) { return d; });

        questionDivs.append("input")
                        .attr("type", "text") // Try something else later
                        .classed("answer-input", true);

        questionDivs.append("p")
                        .classed("hidden", true)
                        .classed("question-feedback", true);

        let buttonContainer = rootContainer.append("div")
                                                .classed("button-container", true);
        
        buttonContainer.append("input")
                        .attr("type", "button")
                        .attr("value", "Submit answers")
                        .attr("onclick", "nt.check_exercises(document.getElementById(\""+containerId+"\").id)")
                        .classed("submit-button", true);

        buttonContainer.append("input")
                        .attr("type", "button")
                        .attr("value", "Show solutions")
                        .attr("onclick", "nt.display_solutions(document.getElementById(\""+containerId+"\").id)")
                        .classed("show-solutions-button", true)
                        .classed("hidden", true);
    },
    check_exercises : function(containerId) {
        if(typeof(containerId) != "string") {
            console.error("containerId must be the id of the question container!");
            return;
        }
    
        let rootContainer = d3.select("#"+containerId);
        let data = this.containers[containerId].json;
        let jsonLength = Object.keys(data).length;
        let answers = [];
        for(let i = 0; i < jsonLength; ++i) {
            answers.push(data[(i+1).toString()].answer);
        }
        let inputtedAnswers = d3.select("#" + containerId)
        .selectAll(".answer-input")
            .filter(function(d, i) {
                if(answers[i] == this.value) {
                    style.display = "none";
                    rootContainer.selectAll(".question-feedback")
                                                    .filter(function(d, j) {
                                                        if(j == i) {
                                                            d3.select(this)
                                                                .classed("hidden", false)
                                                                .classed("correct", true)
                                                                .classed("rendered_html", false)
                                                                .text("Correct!");
                                                        }
                                                    });
                }

                else {
                    console.log("Incorrect.")
                    d3.select(this)
                        .transition().duration(500)
                            .style("background-color", "red")
                            .each("end", function() {
                                d3.select(this).transition().duration(500)
                                    .style("background-color", "white")
                            })
                }
            });
    
        if(rootContainer.select(".show-solutions-button").classed("hidden"))
            rootContainer.select(".show-solutions-button").classed("hidden", false);
    },
    display_solutions : function(containerId) {
        if(typeof(containerId) != "string") {
            console.log("containerId must be the id of the question container!");
            return;
        }
    
        let qContainer = d3.select("#"+this.containers[containerId].solutions);
        if(!qContainer[0][0]) {
            console.error("Container with that id does not exist: " + containers[containerId].solutions + ". Please make sure you register the correct containers!");
            return;
        }
    
        let solutionsContainer = d3.select("#"+containerId);
        if(!solutionsContainer[0][0]) {
            console.log("Container with that id does not exist: " + containerId + ". Please try again!");
            return;
        }
    
        let solutions = [];
        let data = this.containers[containerId].json;
        let jsonLength = Object.keys(data).length;
        console.log(data[1]);
        for(let i = 0; i < jsonLength; ++i) {
            solutions.push([]);
            console.log(data[i+1]);
            if(this.containers[containerId].displayExplaination || data[i+1].explanation == "") {
                solutions[i].push((i+1) + ") " + data[i+1].explanation);
                solutions[i].push(data[i+1].solution);
            }

            else
                solutions[i].push((i+1) + ") " + data[(i+1).toString()].solution);
        }

        let rootContainer = d3.select("#"+this.containers[containerId].solutions);

        let solutionContainers = rootContainer.selectAll("div")
                                                .data(solutions)
                                                    .enter()
                                                        .append("div")
                                                            .classed("solutions-container", true);


        
        solutionContainers.selectAll("p")
                            .data(function(d) { return d; })
                                .enter()
                                    .append("p")
                                        .text(function(d) { return d; })
                                        .style("margin-left", "10px");
    }
}