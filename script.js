// =====================
// AUDIO FUNCTIONS
// =====================
function playYes() {
  const s = new Audio("yes.mp3");
  s.volume = 1;
  s.play();
}

function playNo() {
  const s = new Audio("no.mp3");
  s.volume = 1;
  s.play();
}

// =====================
// BALANCE
// =====================
let balance = 1000; // starting money

function updateBalance() {
  document.getElementById("balanceText").textContent = `Balance: $${balance.toFixed(2)}`;
}

updateBalance();

// =====================
// DOM ELEMENTS
// =====================
const board = document.getElementById("board");
const betInput = document.getElementById("betInput");
const mineInput = document.getElementById("mineInput");
const startBtn = document.getElementById("startBtn");
const cashoutBtn = document.getElementById("cashoutBtn");
const profitText = document.getElementById("profitText");

// =====================
// GAME VARIABLES
// =====================
let tiles = [];
let mines = [];
let gameActive = false;
let revealedSafe = 0;
let betAmount = 0;

// =====================
// BOARD CREATION
// =====================
function createBoard() {
  board.innerHTML = "";
  tiles = [];

  for (let i = 0; i < 25; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.index = i;
    tile.onclick = () => revealTile(i);
    board.appendChild(tile);
    tiles.push(tile);
  }
}

// =====================
// GENERATE MINES
// =====================
function generateMines(count) {
  mines = [];
  while (mines.length < count) {
    let r = Math.floor(Math.random() * 25);
    if (!mines.includes(r)) mines.push(r);
  }
}

// =====================
// START GAME
// =====================
function startGame() {
  if (gameActive) return;

  betAmount = Number(betInput.value);
  let mineCount = Number(mineInput.value);

  if (betAmount <= 0) {
    alert("Bro you gotta bet SOMETHING 💀");
    return;
  }

  if (betAmount > balance) {
    alert("You don't got that kinda bread my guy 😭");
    return;
  }

  balance -= betAmount;
  updateBalance();

  createBoard();
  generateMines(mineCount);

  revealedSafe = 0;
  gameActive = true;

  cashoutBtn.disabled = false;
  startBtn.disabled = true;

  profitText.textContent = "Profit: $0.00";
}

// =====================
// MULTIPLIER CALCULATION
// =====================
function getMultiplier() {
  let tilesLeft = 25 - revealedSafe;
  let minesLeft = mines.length;
  let chanceSafe = (tilesLeft - minesLeft) / tilesLeft;
  let multi = 1 / chanceSafe;

  return Math.pow(1.05, revealedSafe).toFixed(2);

}

// =====================
// REVEAL TILE
// =====================
function revealTile(i) {
  if (!gameActive) return;

  const tile = tiles[i];

  if (tile.classList.contains("revealed")) return;

  if (mines.includes(i)) {
    playNo();
    tile.classList.add("bomb");
    tile.textContent = "💣";
    loss();
    return;
  }

  playYes();
  tile.classList.add("revealed");
  tile.textContent = "💎";
  revealedSafe++;

  let multiplier = getMultiplier();
  let profit = (betAmount * multiplier - betAmount).toFixed(2);
  profitText.textContent = `Profit: $${profit}`;
}

// =====================
// LOSS
// =====================
function loss() {
  gameActive = false;
  cashoutBtn.disabled = true;
  startBtn.disabled = false;

  profitText.textContent = "You Lost 😭";
}

// =====================
// CASHOUT
// =====================
function cashout() {
  if (!gameActive) return;
  gameActive = false;

  // play cashout sound
  const cashoutSound = new Audio("cashout.mp3");
  cashoutSound.volume = 1;
  cashoutSound.play();

  let multiplier = getMultiplier();
  let total = (betAmount * multiplier).toFixed(2);

  profitText.textContent = `Cashed Out: $${total}`;

  // add winnings to balance
  balance += Number(total);
  updateBalance();

  cashoutBtn.disabled = true;
  startBtn.disabled = false;
}



// =====================
// BUTTON EVENTS
// =====================
startBtn.onclick = startGame;
cashoutBtn.onclick = cashout;

// =====================
// INITIAL BOARD
// =====================
createBoard();




// =====================
// KEYBOARD SHORTCUT: REMOVE MINES
// =====================




document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "c") {
    if (!gameActive) return;

    mines = []; 
  }
});
