$(document).ready(function(){

	////////////////////////////
	///////MAIN VARIABLES///////
	////////////////////////////
	const freshDeck = createDeck(); // Fresh, perfect deck of cards!
	var playersHand = [];
	var dealersHand = [];
	var theDeck = freshDeck.slice(); // slice() will make a copy of the deck rather than point at freshDeck
	var money = 100;
	

	////////////////////////////
	///////EVENT HANDLERS///////
	////////////////////////////
	$('.deal-button').click(function(){
		// Deal stuff happens here
		// shuffleDeck(); // Now deck has been shuffled
		// console.log(theDeck);
		// console.log(freshDeck);
		reset();

		money -= 10;
		$('.money').html(money);

		// We have a shuffled deck, add the 1st and 3rd cards to the playersHand, 2nd and 4th to the dealersHand
		playersHand.push(theDeck.shift()); // 1st card on shuffled deck to player
		dealersHand.push(theDeck.shift()); // Next top card to dealer
		playersHand.push(theDeck.shift());
		dealersHand.push(theDeck.shift());

		// Change the DOM to add the images
		// placeCard(DOM name of who, card-X for slot, card value to send)
		placeCard('player', 1, playersHand[0]);
		placeCard('player', 2, playersHand[1]);

		placeCard('dealer', 1, dealersHand[0]);
		placeCard('dealer', 2, dealersHand[1]);

		calculateTotal(playersHand, 'player')
		calculateTotal(dealersHand, 'dealer')

		// checkBlackjack();
	})

	$('.hit-button').click(function(){
		// Hit functionality...
		// Player wants a new card. This means:
		// 	1. shift off of theDeck
		// 	2. push on to playersHand
		// 	3. run placeCard to put the new card (image) in the DOM
		// 	4. run calculateTotal to find out the new hand total

		if (calculateTotal(playersHand, 'player') < 21){
			playersHand.push(theDeck.shift()); // This takes care of 1 and 2
			var lastCardIndex = playersHand.length - 1;
			var slotForNewCard = playersHand.length;
			placeCard('player', slotForNewCard, playersHand[lastCardIndex]); // #3
			calculateTotal(playersHand, 'player'); // #4
			if (calculateTotal(playersHand, 'player') >= 21){
				checkWin();
			}
		}
	})

	$('.stand-button').click(function(){
		// On click stand
		// Player has given control over to the dealer
		// Dealer MUST hit until dealer has 17 or more
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		while (dealerTotal < 17){
			// Hit works the same at hit...
			// 1. push card fromo top of deck onto dealer's hand
			// 2. update DOM (placeCard)
			// 3. update dealerTotal
			dealersHand.push(theDeck.shift());
			var lastCardIndex = dealersHand.length - 1;
			var slotForNewCard = dealersHand.length;
			placeCard('dealer', slotForNewCard, dealersHand[lastCardIndex]);
			dealerTotal = calculateTotal(dealersHand, 'dealer');
		}
		checkWin();
	})

	/////////////////////////////
	//////UTILITY FUNCTIONS//////
	/////////////////////////////
	function createDeck(){
		var newDeck = [];
		// Two loops, one for suit, one for card value
		var suits = ['h','s','d','c'];
		// Outer loop, which iterates the suit/letter...
		for (let s = 0; s < suits.length; s++){
			// Inner loop, which iterates the values/number
			for (let c = 1; c <= 13; c++){
				newDeck.push(c + suits[s]); // JS converts this to a string
			}
		}
		return newDeck;
	}

	function shuffleDeck(){
		// Swap two elements in the array, many many times, to shuffle
		for (let i = 0; i < 14000; i++){
			var random1 = Math.floor(Math.random() * 52);
			var random2 = Math.floor(Math.random() * 52);
			var temp = theDeck[random1] // temporary storage for later
			theDeck[random1] = theDeck[random2]; // overwrite
			theDeck[random2] = temp;
		}
	}

	function placeCard(who, where, what){
		// Find the DOM element, based on the args that we want to change
		// i.e. find the element that we want to put the image in
		var slotForCard = '.' +  who + '-cards .card-' + where;
		var imageTag = '<img src="images/' + what + '.png">';
		var deckImage = '<img src="images/deck.png">';
		if ((who == 'dealer') && (where != 1)){
			$(slotForCard).html(deckImage);
			$(slotForCard).addClass('dealt')
		}else{
			$(slotForCard).html(imageTag);
			$(slotForCard).addClass('dealt')
		}
	}

	function calculateTotal(hand, who){
		// hand will be an array (either playersHand or dealersHand)
		// who will be what the DOM knows the player as (dealer or player)
		var totalHandValue = 0;
		var thisCardValue = 0;
		var hasAce = false;
		var totalAces = 0;
		for (let i = 0; i < hand.length; i++){
			thisCardValue = Number(hand[i].slice(0,-1)); // This will slice off the last character; Number converts from string
			if (thisCardValue > 10){ // This will make face cards = value 10
				thisCardValue = 10;
			}else if (thisCardValue == 1){
				// this is an Ace!
				hasAce = true;
				totalAces++;
				thisCardValue = 11;
			}
			totalHandValue += thisCardValue;
		}
		for (let i = 0; i < totalAces; i++){
			if (totalHandValue > 21){
				totalHandValue -= 10;
			}
		}
		// We have the total, now update the DOM
		var totalToUpdate = '.' + who + '-total-number';
		$(totalToUpdate).text(totalHandValue);
		return totalHandValue;
	}

	// function checkBlackjack(){
	// 	if ((playersHand[0] = 10) && (playersHand[1] = 11)){
	// 		console.log("Blackjack!")
	// 	}else if ((playersHand[0] = 11) && (playersHand[1] = 10)){
	// 		console.log("Blackjack!")
	// 	}
	// }

	function checkWin(){
		var playerTotal = calculateTotal(playersHand, 'player');
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		var winner = "";
		// If player has more than 21, player busts
		if (playerTotal > 21){
			winner = "You have busted. Dealer wins.";
			// money -= 10;
			$('.money').html(money);
		}else if (dealerTotal > 21){
			winner = "Dealer has busted. You win!";
			money += 20;
			$('.money').html(money);
		}else{
			// Neither player has busted. See who won
			if (playerTotal > dealerTotal){
				winner = "You beat the dealer!";
				money += 20;
				$('.money').html(money);
			}else if (playerTotal < dealerTotal){
				winner = "The dealer has bested you. We get your money.";
				// money -= 10;
				$('.money').html(money);
			}else{
				winner = "It's a push!"
			}
		}
		$('.message').text(winner);
	}

	function reset(){
		// In order to reset the game, we need to:
		// 1. reset the deck
		// 2. reset the player and dealer hand arrays
		// 3. reset the cards in the DOM
		// 4. reset the totals for both players
		theDeck = freshDeck.slice();
		shuffleDeck();
		playersHand = [];
		dealersHand = [];
		$('.card').html('');
		$('.dealer-total-number').html('0');
		$('.player-total-number').html('0');
		$('.message').html('&nbsp;');
	}

})