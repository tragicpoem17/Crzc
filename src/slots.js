// Slot machine game logic

const SYMBOLS = ['🍎', '🍌', '🍒', '🍊', '💎'];
const REELS = 3;
const SYMBOLS_PER_REEL = 3;

class SlotMachine {
  constructor(initialBalance = 100) {
    this.balance = initialBalance;
    this.totalWins = 0;
    this.totalSpins = 0;
    this.lastResult = null;
  }

  getRandomSymbol() {
    return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  }

  generateReel() {
    const reel = [];
    for (let i = 0; i < SYMBOLS_PER_REEL; i++) {
      reel.push(this.getRandomSymbol());
    }
    return reel;
  }

  spin(betAmount = 1) {
    if (this.balance < betAmount) {
      return { error: 'Insufficient balance', balance: this.balance };
    }

    this.balance -= betAmount;
    this.totalSpins += 1;

    const reels = [];
    for (let i = 0; i < REELS; i++) {
      reels.push(this.generateReel());
    }

    // Check for wins (middle symbol across all reels match)
    const middleSymbols = [reels[0][1], reels[1][1], reels[2][1]];
    const allMatch = middleSymbols[0] === middleSymbols[1] && middleSymbols[1] === middleSymbols[2];

    let winAmount = 0;
    let won = false;

    if (allMatch) {
      // All three match - win 10x bet
      winAmount = betAmount * 10;
      this.balance += winAmount;
      this.totalWins += 1;
      won = true;
    } else if (middleSymbols[0] === middleSymbols[1] || middleSymbols[1] === middleSymbols[2]) {
      // Two match - win 2x bet
      winAmount = betAmount * 2;
      this.balance += winAmount;
      won = true;
    }

    this.lastResult = {
      reels,
      middleSymbols,
      betAmount,
      won,
      winAmount,
      balance: this.balance,
    };

    return this.lastResult;
  }

  getStats() {
    const winRate = this.totalSpins > 0 ? ((this.totalWins / this.totalSpins) * 100).toFixed(2) : 0;
    return {
      balance: this.balance,
      totalSpins: this.totalSpins,
      totalWins: this.totalWins,
      winRate: `${winRate}%`,
    };
  }

  displayReel(reel) {
    return reel.join(' ');
  }
}

module.exports = { SlotMachine, SYMBOLS };
