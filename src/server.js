// Express API server for slots game

const express = require('express');
const path = require('path');
const { SlotMachine } = require('./slots');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Global slot machine instance per session
const machines = {};

function getMachine(sessionId) {
  if (!machines[sessionId]) {
    machines[sessionId] = new SlotMachine(100);
  }
  return machines[sessionId];
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/api/spin', (req, res) => {
  const { betAmount = 1, sessionId = 'default' } = req.body;
  const machine = getMachine(sessionId);
  const result = machine.spin(betAmount);
  res.json(result);
});

app.get('/api/stats', (req, res) => {
  const { sessionId = 'default' } = req.query;
  const machine = getMachine(sessionId);
  res.json(machine.getStats());
});

app.post('/api/reset', (req, res) => {
  const { sessionId = 'default' } = req.body;
  machines[sessionId] = new SlotMachine(100);
  res.json({ message: 'Machine reset', balance: 100 });
});

app.listen(PORT, () => {
  console.log(`Slots API running on http://localhost:${PORT}`);
});

module.exports = app;
