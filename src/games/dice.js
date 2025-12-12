// Dice game logic

class Dice {
  constructor() {
    this.lastRoll = null;
  }

  rollDice(numDice = 2) {
    const rolls = [];
    for (let i = 0; i < numDice; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    this.lastRoll = rolls;
    return rolls;
  }

  playCraps(betType, betAmount) {
    const rolls = this.rollDice(2);
    const total = rolls[0] + rolls[1];

    let won = false;
    let winAmount = 0;
    let message = '';

    switch (betType) {
      case 'pass':
        // Win on 7 or 11, lose on 2, 3, 12
        if (total === 7 || total === 11) {
          won = true;
          winAmount = betAmount * 2;
          message = `🎉 Natural! ${rolls[0]} + ${rolls[1]} = ${total}. You win!`;
        } else if (total === 2 || total === 3 || total === 12) {
          message = `❌ Craps! ${rolls[0]} + ${rolls[1]} = ${total}. You lose.`;
        } else {
          message = `Point is ${total}. Keep rolling!`;
        }
        break;

      case 'dont_pass':
        // Opposite of pass
        if (total === 2 || total === 3) {
          won = true;
          winAmount = betAmount * 2;
          message = `🎉 ${rolls[0]} + ${rolls[1]} = ${total}. You win!`;
        } else if (total === 7 || total === 11 || total === 12) {
          message = `❌ ${rolls[0]} + ${rolls[1]} = ${total}. You lose.`;
        } else {
          message = `Point is ${total}. Keep rolling!`;
        }
        break;

      case 'field': {
        // Win on 2, 3, 4, 5, 9, 10, 11, 12
        const fieldNumbers = [2, 3, 4, 5, 9, 10, 11, 12];
        won = fieldNumbers.includes(total);
        winAmount = won ? betAmount * 2 : 0;
        message = won ? `🎉 Field win! ${total}. You win!` : `❌ ${total}. You lose.`;
        break;
      }

      default:
        return { error: 'Invalid bet type' };
    }

    return {
      rolls,
      total,
      betType,
      betAmount,
      won,
      winAmount,
      message,
    };
  }

  playHighLow(betType, betAmount) {
    const rolls = this.rollDice(2);
    const total = rolls[0] + rolls[1];

    let won = false;
    let winAmount = 0;

    if (betType === 'high' && total >= 7) {
      won = true;
      winAmount = betAmount * 2;
    } else if (betType === 'low' && total <= 6) {
      won = true;
      winAmount = betAmount * 2;
    }

    return {
      rolls,
      total,
      betType,
      betAmount,
      won,
      winAmount,
      message: won ? `🎉 You rolled ${total}! You win!` : `❌ You rolled ${total}. You lose.`,
    };
  }
}

module.exports = { Dice };
