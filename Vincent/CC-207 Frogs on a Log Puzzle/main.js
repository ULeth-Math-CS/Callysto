resizeBackground();

var FROG = {
  green: {
    color: 'green',
    img: 'imgs/frogGreen.png'
  },
  red: {
    color: 'red',
    img: 'imgs/frogRed.png'
  }
};

var BLANK_SPACE = "blank";
var START_ARRAY = [FROG.red.color, FROG.red.color, FROG.red.color, BLANK_SPACE, FROG.green.color, FROG.green.color, FROG.green.color];
var FINAL_ARRAY = [FROG.green.color, FROG.green.color, FROG.green.color, BLANK_SPACE, FROG.red.color, FROG.red.color, FROG.red.color];

var posArray = START_ARRAY.slice();
var prevArray = [];
var counter = 0;
prevArray.push(START_ARRAY.slice());

window.onresize = function() {
    resizeBackground();
}



$('.frog').click(function () {
  var pos = $(this).index();
  makeMove(pos);
});

function displayFrogs() {
  $('#counter').html(counter);
  for (var i = 0; i < posArray.length; i++) {
    if (posArray[i] == FROG.red.color) {
      $('#pos' + i).html('<img class="clickable" src="' + FROG.red.img + '" alt="red frog" >');
    } else if (posArray[i] == FROG.green.color) {
      $('#pos' + i).html('<img class="clickable" src="' + FROG.green.img + '" alt="green frog" >');
    } else {
      $('#pos' + i).html('<img src="imgs/blankSpace.png" alt="" >');
    }
  }
}

function makeMove(index) {
  if (!compareArrays(prevArray[prevArray.length - 1], posArray))
    prevArray.push(posArray.slice());
  switch (posArray[index]) {
    case FROG.red.color:
      if (posArray[index + 1] == BLANK_SPACE) {
        posArray[index + 1] = FROG.red.color;
        posArray[index] = BLANK_SPACE;
        counter++;
      } else if (posArray[index + 2] == BLANK_SPACE) {
        posArray[index + 2] = FROG.red.color;
        posArray[index] = BLANK_SPACE;
        counter++;
      }
      break;
    case FROG.green.color:
      if (posArray[index - 1] == BLANK_SPACE) {
        posArray[index - 1] = FROG.green.color;
        posArray[index] = BLANK_SPACE;
        counter++;
      } else if (posArray[index - 2] == BLANK_SPACE) {
        posArray[index - 2] = FROG.green.color;
        posArray[index] = BLANK_SPACE;
        counter++;
      }
      break;
  };
  displayFrogs();
  if (compareArrays(posArray, FINAL_ARRAY)) {
    alert('Congratulations, you did it!');
  }
}

function resetFrogs() {
  posArray = START_ARRAY.slice();
  prevArray = [];
  prevArray.push(START_ARRAY.slice());
  counter = 0;
  displayFrogs();
}

function compareArrays(x, y) {
  if (x.length != y.length)
    return false;
  for (var i = 0; i < x.length; i++) {
    if (x[i] != y[i])
      return false;
  }
  return true;
}

function undo() {
  if (prevArray[prevArray.length - 1] != null) {
    if (compareArrays(prevArray[prevArray.length - 1], posArray) && prevArray.length > 1) {
      prevArray.pop();
    }
    posArray = prevArray[prevArray.length - 1].slice();
    if (prevArray.length > 1) {
      prevArray.pop();
    }
  }
  if (!compareArrays(prevArray, posArray) && counter > 0)
    counter--;
  displayFrogs();
}

function resizeBackground() {
    $('.mainGrid').width($('.mainGrid').closest('.rendered_html').width());
    $('.mainGrid').height($('.mainGrid').closest('.rendered_html').width() * 0.53);
}
