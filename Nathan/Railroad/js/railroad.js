var currentCard = 0;
var cards = $(".book-card");
var fadeTime = 1500;

for(let i = 1; i < cards.length; ++i) {
    $(cards[i]).hide();
}
   
function nextCard() {
    $(cards[currentCard++]).fadeOut(fadeTime, function() {
        $(cards[currentCard]).fadeIn(fadeTime);
    });
}