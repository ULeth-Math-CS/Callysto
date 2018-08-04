// data = 
// { 
//     "question" : "What year did Japan surrender in World War II?",
//     "answer" : [1, 2],
//     "options" : ["Yo", "No"],
//     "explaination" : "Bombs"
// }

// console.log(nt.determine_type(data));

nt.register("test", "test-solutions", "test.json", function() {
    nt.create_exercises("test");
})