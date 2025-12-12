// Roulette game logic

class Roulette {
  constructor() {
    this.wheel = this.createWheel();
  }

  createWheel() {
    const wheel = [];
    for (let i = 0; i <= 36; i++) {
      wheel.push(i);
    }
    return wheel;
  }

  spin() {
    return Math.floor(Math.random() * 37);
  }

  isRed(number) {
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(number);
  }

  isBlack(number) {
    return number !== 0 && !this.isRed(number);
  }

  isEven(number) {
    return number !== 0 && number % 2 === 0;
  }

  isOdd(number) {
    return number !== 0 && number % 2 === 1;
  }

  playBet(betType, betAmount) {
    const result = this.spin();
    let won = false;
    let winAmount = 0;

    switch (betType) {
      case 'red':
        won = this.isRed(result);
        winAmount = won ? betAmount * 2 : 0;
        break;
      case 'black':
        won = this.isBlack(result);
        winAmount = won ? betAmount * 2 : 0;
        break;
      case 'even':
        won = this.isEven(result);
        winAmount = won ? betAmount * 2 : 0;
        break;
      case 'odd':
        won = this.isOdd(result);
        winAmount = won ? betAmount * 2 : 0;
        break;
      case 'straight':
        // Assumes betAmount encodes the number (simplified)
        won = Math.random() < 1 / 37;
        winAmount = won ? betAmount * 36 : 0;
        break;
      default:
        return { error: 'Invalid bet type' };
    }

    return {
      result,
      betType,
      betAmount,
      won,
      winAmount,
      message: won ? `🎉 Landed on ${result}! You win!` : `❌ Landed on ${result}. You lose.`,
    };
  }
}

module.exports = { Roulette };
