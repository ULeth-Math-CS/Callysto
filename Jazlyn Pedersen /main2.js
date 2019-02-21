function checkAns() {
            console.log('clicked');
            var ansArray = [];
            var questionList = document.getElementById('list');
            for (var i = 0; i < document.getElementsByClassName('correct').length; i++) {
                document.getElementsByClassName('correct')[i].style.display = 'none';  
            }
            for (var i = 0; i < document.getElementsByClassName('wrong').length; i++) {
                document.getElementsByClassName('wrong')[i].style.display = 'none';
            }
            for (var i = 0; i < questionList.children.length; i++) {
                ansArray.push(questionList.children[i].children[1].value);
            }
            ansArray[0] === '4' ? setAns(1, true) : setAns(1, false);
            ansArray[1] === '27' ? setAns(2, true) : setAns(2, false);
            ansArray[2] === 'x, 108' ? setAns(3, true) : setAns(3, false);
            ansArray[3] === '3, 3, 3' ? setAns(4, true) : setAns(4, false);
            ansArray[4] === 'The level of damage' ? setAns(5, true) : setAns(5, false);
        }

        function setAns(pos, isCorrect) {
            var ansId = "Q" + pos + (isCorrect ? "C" : "W");
            var ans = document.getElementById(ansId);
            ans.style.display = "inline";
        }