$(document).ready(function(){
	//-------------------------------
	//-------Main function vars------
	//-------------------------------
	const freshDeck = createDeck();
	// const is a var that will not be changed
	// console.log(freshDeck);
	var theDeck = freshDeck;
	var playersHand = []; // same as player1Square in tic-tac-toe
	var dealersHand = [];

	function createDeck(){
		// local var, newDeck. No one knows about this but createDeck()
		var newDeck = [];
		// local var that WILL NOT be changed, no one can see it but createDeck()
		const suits = ['h', 's', 'd', 'c'];
		// loop for suits (outer loop)
		for (let s = 0; s < suits.length; s++){
			// loop for card values (inner loop)
			for (let c = 1; c <= 13; c++){
				newDeck.push(c + suits[s]); // this concatenates to make the image names
			}
		}
		return newDeck;
	}

	// WHEN USER CLICKS DEAL:
	$('.deal-button').click(function(){
		console.log("User clicked deal");
		theDeck = shuffleDeck();
		// the deck is now shuffled!
		// update the player's and dealer's hands
		// the player always gets the first card in the deck
		playersHand.push(theDeck.shift()); // shift removes the first element in the array and returns it
		dealersHand.push(theDeck.shift());
		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());
		console.log(theDeck.length);
		placeCard('player', 1, playersHand[0]);
		placeCard('dealer', 1, dealersHand[0]);
		placeCard('player', 2, playersHand[1]);
		placeCard('dealer', 2, dealersHand[1]);

		calculateTotal(playersHand, 'player');
		calculateTotal(dealersHand, 'dealer');
	});

	// WHEN USER CLICKS HIT
	$('.hit-button').click(function(){
		console.log("Use clicked hit");
		playersHand.push(theDeck.shift());
		placeCard('player', playersHand.length, playersHand[playersHand.length-1])
		calculateTotal(playersHand, 'player');
	})

	// WHEN USER CLICKS STAND:
	$('.stand-button').click(function(){
		console.log("User clicked stand");
		// What happens to the player when they stand? Nothing.
		// Control goes to the dealer.
		// Rules of blackjack for dealer:
		// -if dealer has less than 17, MUCH hit
		// -if dealer has 17 or more, CANNOT it
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		// console.log(dealerTotal);
		while(dealerTotal < 17){
			dealersHand.push(theDeck.shift());
			placeCard('dealer', dealersHand.length, dealersHand[dealersHand.length-1]);
			dealerTotal = calculateTotal(dealersHand, 'dealer');
		}
		checkWin();
	})

	function checkWin(){
		var playerTotal = calculateTotal(playersHand, 'player');
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		// if player > 21 ... player busts and loses
		// if dealer > 21 ... dealer busts and loses
		// if playersHand.length = 2 and playerTotal = 21 ... BLACKJACK
		// if dealersHand.length = 2 and dealerTotal = 21 ... BLACKJACK
		// if player > dealer ... player wins
		// if dealer > player ... dealer wins
		// else ... tie
	}

	function calculateTotal(hand, who){
		// console.log(hand)
		// init total at 0
		var total = 0;
		// create a temp value for this card's value
		var thisCardValue = 0;
		// Loop through the hand (array)
		// Grab the number in the element and add it to the total
		for (let i = 0; i < hand.length; i++){
			thisCardValue = Number(hand[i].slice(0,-1)); // This is to remove the letter in the card name
			// console.log(thisCardValue);
			total += thisCardValue;
		}
		// console.log(total);
		var classSelector = '.' + who + '-total-number';
		$(classSelector).html(total);
		return total;
	}

	function placeCard(who, where, cardToPlace){
		var classSelector = '.' + who + '-cards .card-' + where; // jQuery calls things exactly like CSS
		// console.log(classSelector);
		$(classSelector).html('<img src="images/'+cardToPlace+'.png">');
	}

	function shuffleDeck(){
		// Loop a big number of times
		// Each time through, switch two elements in the array
		// When the loop is done, array will be shuffled
		for (let i = 0; i < 5000; i++){
			var randomCard1 = Math.floor(Math.random() * theDeck.length);
			var randomCard2 = Math.floor(Math.random() * theDeck.length);
			// switch theDeck[randomCard1] with theDeck[randomCard2]
			// Stash the value of theDeck[randomCard1] in temp so we can get it back
			var temp = theDeck[randomCard1];
			// Now it's safe to overwrite theDeck[randomCard1] because we stashed its value in temp
			theDeck[randomCard1] = theDeck[randomCard2];
			// Now we are ready to overwrite theDeck[randomCard2]. We will use theDeck[randomCard1], which we stashed in temp
			theDeck[randomCard2] = temp;
		}
		// console.log(theDeck);
		return theDeck;
	}
});

