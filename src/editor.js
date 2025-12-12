// Game Editor - create and test custom games

class GameEditor {
  constructor() {
    this.customGames = {};
    this.gameTemplates = {
      coinFlip: {
        name: 'Coin Flip',
        description: 'Guess heads or tails',
        outcomes: 2,
        payouts: { correct: 2, wrong: 0 },
      },
      wheel: {
        name: 'Wheel Spin',
        description: 'Spin the wheel for prizes',
        outcomes: 6,
        payouts: { 1: 10, 2: 5, 3: 2, 4: 1, 5: 0.5, 6: 0 },
      },
      lottery: {
        name: 'Lottery',
        description: 'Pick 3 numbers from 10',
        outcomes: 120,
        payouts: { match3: 100, match2: 10, match1: 1 },
      },
    };
  }

  createGame(gameName, gameData) {
    if (!gameName || !gameData) {
      return { error: 'Game name and data required' };
    }

    this.customGames[gameName] = {
      name: gameName,
      created: new Date(),
      ...gameData,
    };

    return { success: true, game: this.customGames[gameName] };
  }

  getGame(gameName) {
    return this.customGames[gameName] || { error: 'Game not found' };
  }

  listGames() {
    return {
      templates: Object.keys(this.gameTemplates),
      custom: Object.keys(this.customGames),
    };
  }

  testGame(gameName, betAmount) {
    const game = this.customGames[gameName];
    if (!game) {
      return { error: 'Game not found' };
    }

    // Simulate random outcome
    const outcome = Math.floor(Math.random() * game.outcomes);
    const payout = game.payouts[outcome] || 0;
    const winAmount = betAmount * payout;

    return {
      gameName,
      betAmount,
      outcome,
      payout,
      winAmount,
      won: payout > 0,
      message: payout > 0 ? `🎉 Won! ${betAmount} × ${payout} = ${winAmount}` : '❌ Lost',
    };
  }

  deleteGame(gameName) {
    if (this.customGames[gameName]) {
      delete this.customGames[gameName];
      return { success: true, message: `Deleted game: ${gameName}` };
    }
    return { error: 'Game not found' };
  }

  getTemplate(templateName) {
    return this.gameTemplates[templateName] || { error: 'Template not found' };
  }
}

module.exports = { GameEditor };
