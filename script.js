let originalMineCount = 0;
let showMines = false;


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
    alert("Bet more than 0 -_-");
    return;
  }

  if (betAmount > balance) {
    alert("UR BROKE LOLLLL");
    return;
  }

  // Error handling for too many mines
  if (mineCount > 24) {
    alert("do u are have stupid");
    return;
  }

  // save the ORIGINAL number of mines for multiplier calculations
  originalMineCount = mineCount;

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
// Pay Money
// =====================

function getMultiplier() {
  let revealed = revealedSafe;
  let m = originalMineCount;

  let totalSafeTiles = 25 - m;

  let factor;

  if (m < 8) {
    factor = 25;
  } 
  else if (m < 17) { 
    factor = 35;
  } 
  else if (m < 23) {
    factor = 50;
  } 
  else { // 23-24 mines
    factor = 85;
  }


  const FINAL_MULTIPLIER = 350 + (m * factor);

 
  let base = Math.pow(FINAL_MULTIPLIER, 1 / totalSafeTiles);

  let multiplier = Math.pow(base, revealed);

  return multiplier.toFixed(2);
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
  if (!gameActive) return;

  // CHEAT: remove all mines
  if (e.key.toLowerCase() === "c") {
    mines = [];

  }

  // CHEAT: reveal/hide all mines
  if (e.key.toLowerCase() === "h") {
    toggleMinesReveal();

  }
});








function toggleMinesReveal() {
  showMines = !showMines; // toggle on/off

  tiles.forEach((tile, index) => {
    if (mines.includes(index)) {
      if (showMines) {
        tile.classList.add("minePreview");
        tile.textContent = "💣";
      } else {
        if (!tile.classList.contains("revealed")) {
          tile.classList.remove("minePreview");
          tile.textContent = "";
        }
      }
    }
  });
}
