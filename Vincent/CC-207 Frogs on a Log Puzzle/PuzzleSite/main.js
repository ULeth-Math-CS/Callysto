const FROG = {
  green: {
    color: 'green',
    img: 'imgs/frogGreen.png'
  },
  red: {
    color: 'red',
    img: 'imgs/frogRed.png'
  }
};

const BLANK_SPACE = "blank";
const START_ARRAY = [FROG.red.color, FROG.red.color, FROG.red.color, BLANK_SPACE, FROG.green.color, FROG.green.color, FROG.green.color];

let posArray = START_ARRAY.slice();
let prevArray = [];
prevArray.push(START_ARRAY.slice());

$('.frog').click(function () {
  let pos = $(this).index();
  makeMove(pos);
});

function displayFrogs() {
  for (let i = 0; i < posArray.length; i++) {
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
      } else if (posArray[index + 2] == BLANK_SPACE) {
        posArray[index + 2] = FROG.red.color;
        posArray[index] = BLANK_SPACE;
      }
      break;
    case FROG.green.color:
      if (posArray[index - 1] == BLANK_SPACE) {
        posArray[index - 1] = FROG.green.color;
        posArray[index] = BLANK_SPACE;
      } else if (posArray[index - 2] == BLANK_SPACE) {
        posArray[index - 2] = FROG.green.color;
        posArray[index] = BLANK_SPACE;
      }
      break;
  };
  displayFrogs();
}

function resetFrogs() {
  posArray = START_ARRAY.slice();
  prevArray = [];
  prevArray.push(START_ARRAY.slice());
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
  displayFrogs();
}
