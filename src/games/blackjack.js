// Blackjack game logic

const CARD_VALUES = {
  A: 11,
  K: 10,
  Q: 10,
  J: 10,
  10: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};

const SUITS = ['♠', '♥', '♦', '♣'];

class Blackjack {
  constructor() {
    this.deck = this.createDeck();
    this.playerHand = [];
    this.dealerHand = [];
    this.playerBet = 0;
    this.gameState = 'betting'; // betting, playing, dealerTurn, finished
    this.result = null;
  }

  createDeck() {
    const deck = [];
    for (const suit of SUITS) {
      for (const value of Object.keys(CARD_VALUES)) {
        deck.push(`${value}${suit}`);
      }
    }
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  drawCard() {
    if (this.deck.length === 0) {
      this.deck = this.createDeck();
    }
    return this.deck.pop();
  }

  getCardValue(card) {
    const value = card.slice(0, -1);
    return CARD_VALUES[value];
  }

  calculateHandValue(hand) {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
      const value = this.getCardValue(card);
      total += value;
      if (card.startsWith('A')) aces += 1;
    }

    while (total > 21 && aces > 0) {
      total -= 10;
      aces -= 1;
    }

    return total;
  }

  start(betAmount) {
    if (betAmount < 1) {
      return { error: 'Invalid bet' };
    }

    this.playerBet = betAmount;
    this.playerHand = [this.drawCard(), this.drawCard()];
    this.dealerHand = [this.drawCard(), this.drawCard()];
    this.gameState = 'playing';

    // Check for blackjack
    const playerValue = this.calculateHandValue(this.playerHand);

    if (playerValue === 21 && this.playerHand.length === 2) {
      this.gameState = 'finished';
      this.result = 'blackjack';
      return { status: 'blackjack', playerHand: this.playerHand, dealerHand: this.dealerHand, message: '🎉 BLACKJACK!' };
    }

    return { status: 'ready', playerHand: this.playerHand, dealerUpCard: this.dealerHand[0] };
  }

  hit() {
    if (this.gameState !== 'playing') {
      return { error: 'Game not in play state' };
    }

    this.playerHand.push(this.drawCard());
    const value = this.calculateHandValue(this.playerHand);

    if (value > 21) {
      this.gameState = 'finished';
      this.result = 'bust';
      return { status: 'bust', playerHand: this.playerHand, message: '💥 BUST! You lose.' };
    }

    return { status: 'playing', playerHand: this.playerHand, playerValue: value };
  }

  stand() {
    if (this.gameState !== 'playing') {
      return { error: 'Game not in play state' };
    }

    this.gameState = 'dealerTurn';
    const playerValue = this.calculateHandValue(this.playerHand);

    // Dealer hits on 16, stands on 17+
    while (this.calculateHandValue(this.dealerHand) < 17) {
      this.dealerHand.push(this.drawCard());
    }

    const finalDealerValue = this.calculateHandValue(this.dealerHand);

    let winAmount = 0;
    let message = '';

    if (finalDealerValue > 21) {
      winAmount = this.playerBet * 2;
      message = '🎉 Dealer busts! You win!';
    } else if (finalDealerValue > playerValue) {
      message = '❌ Dealer wins.';
    } else if (finalDealerValue < playerValue) {
      winAmount = this.playerBet * 2;
      message = '🎉 You win!';
    } else {
      winAmount = this.playerBet;
      message = '🤝 Push (Tie).';
    }

    this.gameState = 'finished';
    this.result = message;

    return {
      status: 'finished',
      playerHand: this.playerHand,
      dealerHand: this.dealerHand,
      playerValue,
      dealerValue: finalDealerValue,
      winAmount,
      message,
    };
  }
}

module.exports = { Blackjack };
