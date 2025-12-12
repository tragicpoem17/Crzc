// CLI tool for slots game
const { SlotMachine } = require('./slots');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const machine = new SlotMachine(100);

function displayReels() {
  if (!machine.lastResult) return;
  const { reels, middleSymbols, won, winAmount } = machine.lastResult;
  console.log('\n--- SPIN RESULT ---');
  reels.forEach((reel, i) => {
    console.log(`Reel ${i + 1}: ${machine.displayReel(reel)}`);
  });
  console.log(`\nMiddle symbols: ${middleSymbols.join(' | ')}`);
  if (won) {
    console.log(`🎉 WIN! +${winAmount} credits`);
  } else {
    console.log('❌ No match');
  }
  console.log(`Balance: ${machine.balance} credits\n`);
}

function prompt() {
  rl.question('Enter bet amount (or "stats"/"quit"): ', (answer) => {
    if (answer.toLowerCase() === 'quit') {
      console.log('\nFinal stats:', machine.getStats());
      rl.close();
      return;
    }

    if (answer.toLowerCase() === 'stats') {
      console.log('\n--- STATS ---');
      console.log(machine.getStats());
      console.log('');
      prompt();
      return;
    }

    const bet = parseInt(answer, 10);
    if (isNaN(bet) || bet < 1) {
      console.log('Invalid bet amount');
      prompt();
      return;
    }

    const result = machine.spin(bet);
    if (result.error) {
      console.log(`Error: ${result.error}`);
    } else {
      displayReels();
    }

    prompt();
  });
}

console.log('🎰 Welcome to DevCrazino Slots!');
console.log('Starting balance: 100 credits');
console.log('Commands: number (bet), "stats", or "quit"\n');

prompt();

module.exports = { machine };

