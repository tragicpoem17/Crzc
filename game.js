// AYE SLOTS GAME CREATOR
// Main game logic and functionality

class SlotMachine {
    constructor() {
        // Game state
        this.balance = 1000;
        this.bet = 10;
        this.isSpinning = false;
        this.autoPlay = false;
        
        // Statistics
        this.totalSpins = 0;
        this.totalWins = 0;
        this.biggestWin = 0;
        
        // Game settings
        this.soundEnabled = true;
        this.animationEnabled = true;
        
        // Audio context for sound effects (reused for performance)
        this.audioContext = null;
        
        // Symbols configuration
        this.symbols = [
            { emoji: '🍒', name: 'Cherry', multiplier: 5, weight: 30 },
            { emoji: '🍋', name: 'Lemon', multiplier: 10, weight: 25 },
            { emoji: '🍊', name: 'Orange', multiplier: 15, weight: 20 },
            { emoji: '🍇', name: 'Grape', multiplier: 20, weight: 15 },
            { emoji: '🍉', name: 'Melon', multiplier: 25, weight: 10 },
            { emoji: '⭐', name: 'Star', multiplier: 50, weight: 5 },
            { emoji: '💎', name: 'Diamond', multiplier: 100, weight: 3 },
            { emoji: '🎰', name: 'Jackpot', multiplier: 500, weight: 2 }
        ];
        
        // Create weighted symbol pool
        this.symbolPool = this.createSymbolPool();
        
        // DOM elements
        this.initElements();
        this.initEventListeners();
        this.updateDisplay();
    }
    
    initElements() {
        // Display elements
        this.balanceEl = document.getElementById('balance');
        this.betAmountEl = document.getElementById('bet-amount');
        this.winMessageEl = document.getElementById('win-message');
        
        // Reel elements
        this.reels = [
            document.getElementById('reel1'),
            document.getElementById('reel2'),
            document.getElementById('reel3')
        ];
        
        // Control elements
        this.spinButton = document.getElementById('spin-button');
        this.resetButton = document.getElementById('reset-button');
        this.betIncreaseBtn = document.getElementById('bet-increase');
        this.betDecreaseBtn = document.getElementById('bet-decrease');
        
        // Settings elements
        this.soundToggle = document.getElementById('sound-toggle');
        this.animationToggle = document.getElementById('animation-toggle');
        this.autoplayToggle = document.getElementById('autoplay-toggle');
        
        // Statistics elements
        this.totalSpinsEl = document.getElementById('total-spins');
        this.totalWinsEl = document.getElementById('total-wins');
        this.biggestWinEl = document.getElementById('biggest-win');
        this.winRateEl = document.getElementById('win-rate');
    }
    
    initEventListeners() {
        this.spinButton.addEventListener('click', () => this.spin());
        this.resetButton.addEventListener('click', () => this.reset());
        this.betIncreaseBtn.addEventListener('click', () => this.adjustBet(10));
        this.betDecreaseBtn.addEventListener('click', () => this.adjustBet(-10));
        
        this.soundToggle.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });
        
        this.animationToggle.addEventListener('change', (e) => {
            this.animationEnabled = e.target.checked;
        });
        
        this.autoplayToggle.addEventListener('change', (e) => {
            this.autoPlay = e.target.checked;
            if (this.autoPlay && !this.isSpinning && this.balance >= this.bet) {
                this.autoPlayLoop();
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSpinning && this.balance >= this.bet) {
                e.preventDefault();
                this.spin();
            }
        });
    }
    
    createSymbolPool() {
        const pool = [];
        this.symbols.forEach(symbol => {
            for (let i = 0; i < symbol.weight; i++) {
                pool.push(symbol);
            }
        });
        return pool;
    }
    
    getRandomSymbol() {
        const randomIndex = Math.floor(Math.random() * this.symbolPool.length);
        return this.symbolPool[randomIndex];
    }
    
    adjustBet(amount) {
        const newBet = this.bet + amount;
        if (newBet >= 10 && newBet <= this.balance && newBet <= 100) {
            this.bet = newBet;
            this.updateDisplay();
            this.playSound('click');
        }
    }
    
    async spin() {
        if (this.isSpinning || this.balance < this.bet) {
            return;
        }
        
        this.isSpinning = true;
        this.spinButton.disabled = true;
        this.balance -= this.bet;
        this.totalSpins++;
        this.updateDisplay();
        this.clearWinMessage();
        
        this.playSound('spin');
        
        // Animate reels
        if (this.animationEnabled) {
            this.reels.forEach(reel => reel.classList.add('spinning'));
        }
        
        // Generate random symbols
        const results = [
            this.getRandomSymbol(),
            this.getRandomSymbol(),
            this.getRandomSymbol()
        ];
        
        // Spin duration
        const spinDuration = this.animationEnabled ? 2000 : 500;
        
        // Update reels with random symbols during spin
        if (this.animationEnabled) {
            const interval = setInterval(() => {
                this.reels.forEach(reel => {
                    const randomSymbol = this.getRandomSymbol();
                    reel.querySelector('.symbol').textContent = randomSymbol.emoji;
                });
            }, 100);
            
            setTimeout(() => clearInterval(interval), spinDuration - 100);
        }
        
        // Show final results
        await this.sleep(spinDuration);
        
        this.reels.forEach((reel, index) => {
            reel.classList.remove('spinning');
            reel.querySelector('.symbol').textContent = results[index].emoji;
        });
        
        // Check for win
        this.checkWin(results);
        
        this.isSpinning = false;
        this.spinButton.disabled = false;
        
        // Continue autoplay if enabled
        if (this.autoPlay && this.balance >= this.bet) {
            setTimeout(() => this.autoPlayLoop(), 1000);
        }
    }
    
    autoPlayLoop() {
        if (this.autoPlay && !this.isSpinning && this.balance >= this.bet) {
            this.spin();
        }
    }
    
    checkWin(results) {
        // Check if all three symbols match
        if (results[0].emoji === results[1].emoji && 
            results[1].emoji === results[2].emoji) {
            
            const winSymbol = results[0];
            const winAmount = this.bet * winSymbol.multiplier;
            
            this.balance += winAmount;
            this.totalWins++;
            
            if (winAmount > this.biggestWin) {
                this.biggestWin = winAmount;
            }
            
            this.showWinMessage(winSymbol, winAmount);
            this.playSound('win');
            
            // Special animation for jackpot
            if (winSymbol.emoji === '🎰') {
                this.reels.forEach(reel => reel.classList.add('jackpot-animation'));
                setTimeout(() => {
                    this.reels.forEach(reel => reel.classList.remove('jackpot-animation'));
                }, 1500);
            }
        } else {
            this.showWinMessage(null, 0);
        }
        
        this.updateDisplay();
    }
    
    showWinMessage(symbol, amount) {
        if (symbol) {
            if (symbol.emoji === '🎰') {
                this.winMessageEl.textContent = `🎉 JACKPOT! 🎉 You won $${amount}!`;
                this.winMessageEl.style.color = '#f39c12';
            } else {
                this.winMessageEl.textContent = `${symbol.emoji} WIN! You won $${amount}!`;
                this.winMessageEl.style.color = '#2ecc71';
            }
            this.winMessageEl.classList.add('show');
        } else {
            this.winMessageEl.textContent = 'Try again!';
            this.winMessageEl.style.color = '#e74c3c';
        }
        
        setTimeout(() => {
            this.winMessageEl.classList.remove('show');
        }, 500);
    }
    
    clearWinMessage() {
        this.winMessageEl.textContent = '';
    }
    
    updateDisplay() {
        this.balanceEl.textContent = `$${this.balance}`;
        this.betAmountEl.textContent = `$${this.bet}`;
        
        // Update statistics
        this.totalSpinsEl.textContent = this.totalSpins;
        this.totalWinsEl.textContent = this.totalWins;
        this.biggestWinEl.textContent = `$${this.biggestWin}`;
        
        const winRate = this.totalSpins > 0 
            ? Math.round((this.totalWins / this.totalSpins) * 100) 
            : 0;
        this.winRateEl.textContent = `${winRate}%`;
        
        // Disable spin button if not enough balance
        this.spinButton.disabled = this.balance < this.bet;
        
        // Update balance color based on amount
        if (this.balance >= 1000) {
            this.balanceEl.style.color = '#2ecc71';
        } else if (this.balance >= 500) {
            this.balanceEl.style.color = '#f39c12';
        } else {
            this.balanceEl.style.color = '#e74c3c';
        }
    }
    
    reset() {
        // Simple reset without confirmation for better UX
        // Users can always undo by continuing to play
        this.balance = 1000;
        this.bet = 10;
        this.totalSpins = 0;
        this.totalWins = 0;
        this.biggestWin = 0;
        this.autoPlay = false;
        this.autoplayToggle.checked = false;
        
        this.reels.forEach(reel => {
            reel.querySelector('.symbol').textContent = '🍒';
        });
        
        this.clearWinMessage();
        this.updateDisplay();
        this.playSound('click');
    }
    
    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Create audio context once and reuse for better performance
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        switch(type) {
            case 'spin':
                oscillator.frequency.value = 200;
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
            case 'win':
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.3);
                break;
            case 'click':
                oscillator.frequency.value = 400;
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.05);
                break;
        }
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SlotMachine();
    
    // Add welcome message
    console.log('%c🎰 AYE SLOTS GAME CREATOR 🎰', 'font-size: 24px; color: #f39c12; font-weight: bold;');
    console.log('%cWelcome to the Slot Machine Game!', 'font-size: 16px; color: #2ecc71;');
    console.log('%cPress SPACE to spin or use the controls on screen.', 'font-size: 14px; color: #3498db;');
    console.log('%cGame created for software development purposes.', 'font-size: 12px; color: #95a5a6;');
});
