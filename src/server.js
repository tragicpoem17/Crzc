// Express API server with multiple games and editor

const express = require('express');
const path = require('path');
const { SlotMachine } = require('./slots');
const { Blackjack } = require('./games/blackjack');
const { Roulette } = require('./games/roulette');
const { Dice } = require('./games/dice');
const { GameEditor } = require('./editor');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Game instances per session
const sessions = {};
const gameEditor = new GameEditor();

function getSession(sessionId) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      balance: 100,
      slots: new SlotMachine(100),
      blackjack: new Blackjack(),
      roulette: new Roulette(),
      dice: new Dice(),
    };
  }
  return sessions[sessionId];
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Slots routes
app.post('/api/spin', (req, res) => {
  const { betAmount = 1, sessionId = 'default' } = req.body;
  const session = getSession(sessionId);
  const result = session.slots.spin(betAmount);
  if (!result.error) {
    session.balance = result.balance;
  }
  res.json(result);
});

app.get('/api/stats', (req, res) => {
  const { sessionId = 'default' } = req.query;
  const session = getSession(sessionId);
  res.json({ balance: session.balance, ...session.slots.getStats() });
});

// Blackjack routes
app.post('/api/blackjack/start', (req, res) => {
  const { betAmount = 1, sessionId = 'default' } = req.body;
  const session = getSession(sessionId);
  session.blackjack = new Blackjack();
  const result = session.blackjack.start(betAmount);
  res.json(result);
});

app.post('/api/blackjack/hit', (req, res) => {
  const { sessionId = 'default' } = req.body;
  const session = getSession(sessionId);
  const result = session.blackjack.hit();
  res.json(result);
});

app.post('/api/blackjack/stand', (req, res) => {
  const { sessionId = 'default' } = req.body;
  const session = getSession(sessionId);
  const result = session.blackjack.stand();
  res.json(result);
});

// Roulette routes
app.post('/api/roulette/spin', (req, res) => {
  const { betType, betAmount = 1 } = req.body;
  const roulette = new Roulette();
  const result = roulette.playBet(betType, betAmount);
  res.json(result);
});

// Dice routes
app.post('/api/dice/craps', (req, res) => {
  const { betType, betAmount = 1 } = req.body;
  const dice = new Dice();
  const result = dice.playCraps(betType, betAmount);
  res.json(result);
});

app.post('/api/dice/highlow', (req, res) => {
  const { betType, betAmount = 1 } = req.body;
  const dice = new Dice();
  const result = dice.playHighLow(betType, betAmount);
  res.json(result);
});

// Game Editor routes
app.get('/api/editor/games', (req, res) => {
  res.json(gameEditor.listGames());
});

app.post('/api/editor/create', (req, res) => {
  const { gameName, gameData } = req.body;
  const result = gameEditor.createGame(gameName, gameData);
  res.json(result);
});

app.post('/api/editor/test', (req, res) => {
  const { gameName, betAmount = 1 } = req.body;
  const result = gameEditor.testGame(gameName, betAmount);
  res.json(result);
});

app.post('/api/editor/delete', (req, res) => {
  const { gameName } = req.body;
  const result = gameEditor.deleteGame(gameName);
  res.json(result);
});

app.post('/api/reset', (req, res) => {
  const { sessionId = 'default' } = req.body;
  sessions[sessionId] = {
    balance: 100,
    slots: new SlotMachine(100),
    blackjack: new Blackjack(),
    roulette: new Roulette(),
    dice: new Dice(),
  };
  res.json({ message: 'Session reset', balance: 100 });
});

app.listen(PORT, () => {
  console.log(`🎰 DevCrazino running on http://localhost:${PORT}`);
  console.log('Games: Slots, Blackjack, Roulette, Dice');
  console.log('Editor available at /api/editor/*');
});

module.exports = app;
