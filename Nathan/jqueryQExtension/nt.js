var nt = {
    containers : { },
    register : function(questionsContainer, solutionsContainer, jsonPath, callback, displayExplaination=true) {
        // Check for correct arguments
        if($("#"+questionsContainer).length == 0) {
            console.error("Container with id " + questionsContainer + " does not exist. Please make an id to store the exercises.");
            return;
        }

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
            console.warn("container with id " + questionsContainer + " is about to overidden. Did you mean to do that?");
        }

        // Get json and make register it to the object associated with the container
        this.containers[questionsContainer] =
                                            {
                                                "solutions" : solutionsContainer,
                                                "displayExplaination" : displayExplaination
                                            };
        this.getJson(questionsContainer, jsonPath, callback);
        console.log(this.containers);
    },
    registerJson : function(questionsContainer, data, callback) {
        console.log(this.containers);
        this.containers[questionsContainer].json = data;
        callback();
    },
    getJson : function(questionsContainer, jsonPath, callback) {
        $.getJSON(jsonPath, function(data) {
            nt.registerJson(questionsContainer, data, callback);
        });
    },
    create_exercises : function(containerId) {
        // Check for correct arguments and that the container has been registered.
        if(typeof(containerId) != "string") {
            console.error("containerId must be the id of the question container!");
            return;
        }

        if(!(containerId in this.containers)) {
            console.error("You have no registered container with containerId: " + containerId);
            return;
        }

        let containerData = this.build_container_data(containerId, this.containers[containerId].json);

        let rootContainer = $("#" + containerId);
        // Make a new div for every question there is in the data.
        $.each(containerData.questions, function(index, val) {
          $(rootContainer).append(`<div class="question-container ${containerData.types[index]}"></div>`);
        })

        let questionDivs = $(".question-container");
        $.each(containerData.questions, function(index, val) {
          let currentDiv = questionDivs[index];
          $(currentDiv).append(`<p>${index+1}. ${val}</p>`);
        });


        // Separate all the questions into there respectful spots so they can be processed accordingly
        let shortAnswerQuestions = $(".short-answer");

        let multipleChoiceQuestions = $(".multiple-choice");

        let selectAllQuestions = $(".select-all");

        // Start by creating all the short answer questions
        $.each(shortAnswerQuestions, function(index, val) {
          let width = "300px";
          let answerLength = String(containerData.shaQuestions[index].answer).length;
          if(answerLength >= 0 && answerLength < 10)
            width = "100px";
          else if(answerLength > 10 && answerLength < 30) {
            width = "200px";
          }
          $(shortAnswerQuestions[index]).append(`<input type="text" style="width: ${width}">`);
        });

        // Create multiple choice questions
        $.each(multipleChoiceQuestions, function(index, val) {
          let data = containerData.mcQuestions[index].options;
          $.each(data, function(i, val){
            $(multipleChoiceQuestions[index]).append(`<span><input type="radio" name="mc-option-${index}"><label>${data[i]}</label></span>`)
          })
        });

        // Create select all questions
        $.each(selectAllQuestions, function(index, val) {
          let data = containerData.saQuestions[index].options;
          $.each(data, function(i, val) {
            $(selectAllQuestions[index]).append(`<span><input type="radio" name="selectAll-option-${i}"<label>${data[i]}</label>`)
          });
        });

        questionDivs.append(`<p class="hidden question-feedback"></p>`);
        // // Create the buttons which all the user to submit questions and display the solutins
        rootContainer.append(`<div class="button-container"></div>`);
        let buttonContainer = $(".button-container");

        buttonContainer.append(`<input type="button" class="submit-button" value="Submit Answers" onclick="nt.check_exercises('${containerId}')">`);
        buttonContainer.append(`<input type="button" class="hidden show-solutions-button" value="Show solutions" onclick="nt.display_solutions('${containerId}')">`);
    },
    check_exercises : function(containerId) {
        if(typeof(containerId) != "string") {
            console.error("containerId must be the id of the question container!");
            return;
        }

        let containerData = this.containers[containerId].data,
            rootContainer = $("#"+containerId),
            questionDivs = $(".question-container");

        // Short-answer answer compare
        let shortAnswerFeedback = $(".short-answer .question-feedback"),
            shInputs = $(".short-answer input");

        $.each(shInputs, function(index, val) {
          let answer = containerData.shaQuestions[index].answer,
              correct = false;

          if(nt.is_fraction($(shInputs[index]).val()) && nt.is_fraction(answer)) {
            correct = nt.evaluate_fraction($(shInputs[index]).val()) == nt.evaluate_fraction(answer);
          }
          else {
            correct = this.value == answer;
          }

          if(correct) {
            $(shortAnswerFeedback[index]).removeClass("hidden incorrect").addClass("correct").html("Correct!");
          }
          else {
            $(shortAnswerFeedback[index]).removeClass("hidden correct").addClass("incorrect").html("Incorrect!");
          }
        });

        let mcQuestions = $(".multiple-choice"),
            mcFeedback = $(".multiple-choice .question-feedback");

        $.each(mcQuestions, function(index, val) {
          let mcInputs = $(mcQuestions[index]).find("input"),
              answer = containerData.mcQuestions[index].answer;

          if($(mcInputs[answer]).prop("checked")) {
            $(mcFeedback[index]).removeClass("hidden incorrect").addClass("correct").html("Correct!");
          }

          else {
            $(mcFeedback[index]).removeClass("hidden correct").addClass("incorrect").html("Incorrect.");
          }
        })

        let saQuestions = $(".select-all"),
            saFeedback = $(".select-all .question-feedback");

        $.each(saQuestions, function(index, val) {
          let saInputs = $(saQuestions[index]).find("input"),
              answer = containerData.saQuestions[index].answer,
              correct = true;

          $.each(answer, function(i, v) {
            if(!$(saInputs[v]).prop("checked")) {
              correct = false;
              return false;
            }
          });

          if(correct) {
            $(saFeedback[index]).removeClass("hidden incorrect").addClass("correct").html("Correct!");
          }
          else {
            $(saFeedback[index]).removeClass("hidden correct").addClass("incorrect").html("Incorrect.");
            $.each(saInputs, function(i, v) {
              $(saInputs[i]).prop("checked", false);
            });
          }
        });

        // Unhide the show solutions button.
        $(".show-solutions-button").removeClass("hidden");
    },
    display_solutions : function(containerId) {
        if(typeof(containerId) != "string") {
            console.log("containerId must be the id of the question container!");
            return;
        }

        let solutionsContainer = $("#"+this.containers[containerId].solutions);
        // let solutionsContainer = d3.select("#"+this.containers[containerId].solutions);
        // if(!solutionsContainer[0][0]) {
        //     console.log("Container with that id does not exist: " + containerId + ". Please try again!");
        //     return;
        // }
        //
        // let answers = [];
        // let data = this.containers[containerId].json;
        // let jsonLength = Object.keys(data).length;
        // for(let i = 0; i < jsonLength; ++i) {
        //     answers.push([]);
        //     console.log(data[i+1]);
        //     if(this.containers[containerId].displayExplaination && data[i+1].explanation != "") {
        //         answers[i].push((i+1) + ") " + data[i+1].explanation);
        //         if(this.determine_type(data[i+1]) == "short-answer")
        //             answers[i].push(data[i+1].solution);
        //     }
        //
        //     else if(this.determine_type(data[i+1]) == "short-answer")
        //         answers[i].push((i+1) + ") " + data[(i+1).toString()].solution);
        // }
        //
        // let rootContainer = d3.select("#"+this.containers[containerId].solutions);
        //
        // let solutionContainers = rootContainer.selectAll("div")
        //                                         .data(answers)
        //                                             .enter()
        //                                                 .append("div")
        //                                                     .classed("solutions-container", true);
        //
        //
        //
        // solutionContainers.selectAll("p")
        //                     .data(function(d) { return d; })
        //                         .enter()
        //                             .append("p")
        //                                 .text(function(d) { return d; })
        //                                 .style("margin-left", "10px");
    },
    determine_type : function(obj) {
        if(obj.hasOwnProperty("solution")) {
            return "short-answer";
        }

        else if(obj.hasOwnProperty("options")) {
            if(obj.hasOwnProperty("answer")) {
                if(Array.isArray(obj.answer)) {
                    return "select-all";
                }

                else
                    return "multiple-choice";
            }
        }
    },
    is_fraction : function(x) {
        if(x.indexOf('/') < 0) {
            console.log("ITS NOT A FRACTION");
            return false;
        }
        console.log("ITS A FRACTION");
        return true;
    },
    evaluate_fraction : function(x) {
        sFraction = x.replace(/\s/g, '');
        let offset = sFraction.indexOf('/');
        let n = parseInt(sFraction.substr(0, offset));
        let d = parseInt(sFraction.substr(offset+1));
        return n / d;
    },
    build_container_data : function(containerId, json) {
      // Multiple Choice questions
      let mcQuestions = [];
      // Select All questions
      let saQuestions = [];
      // Short Answer questions
      let shaQuestions = [];
      // Types
      let types = [];
      // Questions
      let questions = [];

      let jsonLength = Object.keys(json).length;
      // Get the types of the questions and the questions
      for(let i = 0; i < jsonLength; ++i) {
          types.push(this.determine_type(json[i+1]));
          if(types[i] == "short-answer") {
              shaQuestions.push(json[i+1])
          }
          else if(types[i] == "multiple-choice") {
              mcQuestions.push(json[i+1]);
          }
          else if(types[i] == "select-all") {
              saQuestions.push(json[i+1]);
          }

          questions.push(json[(i+1).toString()].question);
      }

      this.containers[containerId].data = {
        shaQuestions: shaQuestions,
        mcQuestions: mcQuestions,
        saQuestions: saQuestions,
        questions: questions,
        types: types
      }

      return this.containers[containerId].data;
    }
}
