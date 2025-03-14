const gameBoard = document.querySelector('.game-board');
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const restartButton = document.getElementById('restartButton');

// Game variables
let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let scores = {
    X: 0,
    O: 0
};

// All possible winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function initGame() {
    // Prevent scrolling on mobile devices
    document.addEventListener('touchmove', function(e) {
        if(e.target.closest('.game-board')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    //click event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
   
    restartButton.addEventListener('click', restartGame);
    
    updateScoreboard();
}

/**
 * Handles a cell click event
 * @param {Event} e
 */
function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    // Ignore click if cell is already filled
    if (gameState[cellIndex] !== '' || !gameActive) return;

    // Updates game state and UI
    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    
    // Checks for winning condition
    if (checkWin()) {
        const winningCombo = getWinningCombo();
        animateWin(winningCombo);
        status.textContent = `Player ${currentPlayer} wins!`;
        status.classList.add('winner');
        scores[currentPlayer]++;
        updateScoreboard();
        gameActive = false;
        return;
    }

    // Checks for draw condition
    if (checkDraw()) {
        animateDraw();
        status.textContent = "Game ended in a draw!";
        status.classList.add('draw');
        gameActive = false;
        return;
    }

    // Switch player turn
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
}

/**
 * Checks if the current player has won
 * @returns {boolean} True if current player has won
 */
function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
}

/**
 * Checks if the game is a draw
 * @returns {boolean} True if all cells are filled and no winner
 */
function checkDraw() {
    return gameState.every(cell => cell !== '');
}

/**
 * Gets the winning combination for the current player
 * @returns {Array} The winning combination indices
 */
function getWinningCombo() {
    return winningCombinations.find(combination => {
        return combination.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
}

/**
 * Animates the winning cells
 * @param {Array} winningCombo
 */
function animateWin(winningCombo) {
    const container = document.querySelector('.container');
    container.classList.add('celebrate');
    
    //  win animation to 3 cells
    winningCombo.forEach(index => {
        cells[index].classList.add('win');
    });

    // Remove animations
    setTimeout(() => {
        container.classList.remove('celebrate');
        winningCombo.forEach(index => {
            cells[index].classList.remove('win');
        });
    }, 3000);
}

/**
 * Animates all cells for a draw
 */
function animateDraw() {
    const container = document.querySelector('.container');
    container.classList.add('celebrate');
    
    //draw animation to all cells
    cells.forEach(cell => {
        cell.classList.add('draw');
    });

    // Remove animations
    setTimeout(() => {
        container.classList.remove('celebrate');
        cells.forEach(cell => {
            cell.classList.remove('draw');
        });
    }, 1000);
}

/**
 * Updates the scoreboard with current scores
 */
function updateScoreboard() {
    document.getElementById('scoreX').textContent = scores.X;
    document.getElementById('scoreO').textContent = scores.O;
}

/**
 * Restarts the game to initial state
 */
function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState = ['', '', '', '', '', '', '', '', ''];
    status.textContent = `Player ${currentPlayer}'s turn`;
    status.classList.remove('winner', 'draw');
    
    // Clear all cell content and classes
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'win', 'draw');
    });
}

document.addEventListener('DOMContentLoaded', initGame); 