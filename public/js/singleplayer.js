// Battleship Game - Singleplayer:
import { shipss } from './ships.js';
import { createBoards } from './gameBoard.js';

const userSquares = [];
const computerSquares = [];
const userGrid = document.querySelector('.grid-user');
const computerGrid = document.querySelector('.grid-computer');
const displayGrid = document.querySelector('.grid-display');
const ships = document.querySelectorAll('.ship');
const destroyer = shipss('destroyer');
const submarine = shipss('submarine');
const cruiser = shipss('cruiser');
const battleship = shipss('battleship');
const carrier = shipss('carrier');
const startButton = document.getElementById('start');
const rotateButton = document.getElementById('rotate');
const turnDisplay = document.querySelector('#whose-go');
const infoDisplay = document.querySelector('#info');
const width = 10;
let isHorizontal = true;

createBoards(userGrid, userSquares);
createBoards(computerGrid, computerSquares);

// All Ships:
const shipArray = [
  {
    name: destroyer.getName(),
    directions: destroyer.getDirections(),
  },
  {
    name: submarine.getName(),
    directions: submarine.getDirections(),
  },
  {
    name: cruiser.getName(),
    directions: cruiser.getDirections(),
  },
  {
    name: battleship.getName(),
    directions: battleship.getDirections(),
  },
  {
    name: carrier.getName(),
    directions: carrier.getDirections(),
  },
];

// Generate random location of computer's ships:
const generate = (ship) => {
  let randomDirection = Math.floor(Math.random() * ship.directions.length);
  let current = ship.directions[randomDirection];
  let direction;
  if (randomDirection === 0) direction = 1;
  if (randomDirection === 1) direction = 10;

  let randomStart = Math.abs(
    Math.floor(Math.random() * computerSquares.length - ship.directions[0].length * direction)
  );

  const isTaken = current.some((index) => computerSquares[randomStart + index].classList.contains('taken'));
  const isAtRightEdge = current.some((index) => (randomStart + index) % width === width - 1);
  const isAtLeftEdge = current.some((index) => (randomStart + index) % width === 0);

  if (!isTaken && !isAtLeftEdge && !isAtRightEdge) {
    current.forEach((element) => computerSquares[randomStart + element].classList.add('taken', ship.name));
  } else {
    generate(ship);
  }
};

generate(shipArray[0]);
generate(shipArray[1]);
generate(shipArray[2]);
generate(shipArray[3]);
generate(shipArray[4]);

// Rotate Your Ships:
const rotate = () => {
  if (isHorizontal) {
    destroyer.getElement().classList.toggle('destroyer-container-vertical');
    submarine.getElement().classList.toggle('submarine-container-vertical');
    cruiser.getElement().classList.toggle('cruiser-container-vertical');
    battleship.getElement().classList.toggle('battleship-container-vertical');
    carrier.getElement().classList.toggle('carrier-container-vertical');
    displayGrid.classList.toggle('isHorizontal');
    isHorizontal = false;
    return;
  }

  if (!isHorizontal) {
    destroyer.getElement().classList.toggle('destroyer-container-vertical');
    submarine.getElement().classList.toggle('submarine-container-vertical');
    cruiser.getElement().classList.toggle('cruiser-container-vertical');
    battleship.getElement().classList.toggle('battleship-container-vertical');
    carrier.getElement().classList.toggle('carrier-container-vertical');
    displayGrid.classList.toggle('isHorizontal');
    isHorizontal = true;
  }
};

rotateButton.addEventListener('click', rotate);

ships.forEach((element) => {
  element.addEventListener('dragstart', dragStart);
});

userSquares.forEach((square) => {
  square.addEventListener('dragstart', dragStart);
  square.addEventListener('dragover', dragOver);
  square.addEventListener('dragenter', dragEnter);
  square.addEventListener('dragleave', dragLeave);
  square.addEventListener('drop', dragDrop);
  square.addEventListener('dragend', dragEnd);
});

let selectedShipNameWithIndex;

ships.forEach((element) => {
  element.addEventListener('mousedown', (e) => {
    selectedShipNameWithIndex = e.target.id;
  });
});

let draggedShip;
let draggedShipLength;

function dragStart(e) {
  draggedShip = this;
  for (let i = 0; i < draggedShip.childNodes.length; i++) {
    if (draggedShip.childNodes[i].nodeType === 3) {
      draggedShip.childNodes[i].parentNode.removeChild(draggedShip.childNodes[i]);
    }
  }
  console.log(draggedShip.lastChild.id);
  draggedShipLength = draggedShip.childNodes.length;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {
  console.log('drag leave');
}

// Drag & Drop Your Ships into Board:
function dragDrop() {
  let shipNameWithLastId = draggedShip.lastChild.id;
  let shipClass = shipNameWithLastId.slice(0, -2);
  let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
  let shipLastId = lastShipIndex + parseInt(this.dataset.id);
  let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));
  shipLastId = shipLastId - selectedShipIndex;
  console.log(shipLastId);

  const notAllowedHorizontal = [
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 12, 22, 32, 42, 52, 62, 72, 82, 92,
    3, 13, 23, 33, 43, 53, 63, 73, 83, 93,
  ];
  const notAllowedVertical = [
    99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71,
    70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60,
  ];

  let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
  let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);

  if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
    for (let i = 0; i < draggedShipLength; i++) {
      userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass);
    }
  } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
    for (let i = 0; i < draggedShipLength; i++) {
      userSquares[parseInt(this.dataset.id) - selectedShipIndex + width * i].classList.add('taken', shipClass);
    }
  } else return;

  displayGrid.removeChild(draggedShip);
  console.log(displayGrid.childNodes);
  if (displayGrid.childNodes.length === 6) {
    displayGrid.remove();
    document.querySelector('.hidden-info').remove();
    playGame();
  } else {
    turnDisplay.innerHTML = 'Locate your ships!';
  }
}

function dragEnd() {
  console.log('drag end');
}

let currentPlayer = 'user';
let isGameOver = false;

function playGame() {
  if (isGameOver) return;

  if (currentPlayer === 'user') {
    turnDisplay.innerHTML = 'Your Go';
    computerSquares.forEach((square) => {
      square.addEventListener('click', () => {
        revealSquare(square);
      });
    });
  }

  if (currentPlayer === 'computer') {
    turnDisplay.innerHTML = 'Computer Go';
    setTimeout(computerGo, 300);
  }
}

let destroyerCount = 0;
let submarineCount = 0;
let cruiserCount = 0;
let battleshipCount = 0;
let carrierCount = 0;

function revealSquare(square) {
  if (!square.classList.contains('boom')) {
    if (square.classList.contains('destroyer')) destroyerCount++;
    if (square.classList.contains('submarine')) submarineCount++;
    if (square.classList.contains('cruiser')) cruiserCount++;
    if (square.classList.contains('battleship')) battleshipCount++;
    if (square.classList.contains('carrier')) carrierCount++;
    checkForWin();
  }

  if (square.classList.contains('boom') || square.classList.contains('miss')) {
    return;
  } else {
    if (square.classList.contains('taken')) {
      const fondo = document.createElement('i');
      fondo.classList.add('fas', 'fa-circle');
      square.appendChild(fondo);
      square.classList.add('boom');
    } else {
      const fondo = document.createElement('i');
      fondo.classList.add('fas', 'fa-circle');
      square.appendChild(fondo);
      square.classList.add('miss');
    }
  }
  currentPlayer = 'computer';

  playGame();
}

let cpuDestroyerCount = 0;
let cpuSubmarineCount = 0;
let cpuCruiserCount = 0;
let cpuBattleshipCount = 0;
let cpuCarrierCount = 0;

function computerGo() {
  let random = Math.floor(Math.random() * userSquares.length);

  if (!userSquares[random].classList.contains('boom')) {
    if (userSquares[random].classList.contains('destroyer')) cpuDestroyerCount++;
    if (userSquares[random].classList.contains('submarine')) cpuSubmarineCount++;
    if (userSquares[random].classList.contains('cruiser')) cpuCruiserCount++;
    if (userSquares[random].classList.contains('battleship')) cpuBattleshipCount++;
    if (userSquares[random].classList.contains('carrier')) cpuCarrierCount++;
    checkForWin();
  }

  if (userSquares[random].classList.contains('boom') || userSquares[random].classList.contains('miss')) {
    computerGo();
  } else {
    if (userSquares[random].classList.contains('taken')) {
      const fondo = document.createElement('i');
      fondo.classList.add('fas', 'fa-circle');
      userSquares[random].appendChild(fondo);
      userSquares[random].classList.add('boom');
    } else {
      const fondo = document.createElement('i');
      fondo.classList.add('fas', 'fa-circle');
      userSquares[random].appendChild(fondo);
      userSquares[random].classList.add('miss');
    }
  }

  currentPlayer = 'user';
  turnDisplay.innerHTML = 'Your Go';
}

function checkForWin() {
  if (destroyerCount === 2) {
    infoDisplay.innerHTML = "You sunk computer's Destroyer";
    setTimeout(() => {
      infoDisplay.innerHTML = '';
    }, 2000);
    destroyerCount = 10;
  }
  if (submarineCount === 3) {
    infoDisplay.innerHTML = "You sunk computer's Submarine";
    setTimeout(() => {
      infoDisplay.innerHTML = '';
    }, 2000);
    submarineCount = 10;
  }
  if (cruiserCount === 3) {
    infoDisplay.innerHTML = "You sunk computer's Cruiser";
    setTimeout(() => {
      infoDisplay.innerHTML = '';
    }, 2000);
    cruiserCount = 10;
  }
  if (battleshipCount === 4) {
    infoDisplay.innerHTML = "You sunk computer's Battleship";
    setTimeout(() => {
      infoDisplay.innerHTML = '';
    }, 2000);
    battleshipCount = 10;
  }
  if (carrierCount === 5) {
    infoDisplay.innerHTML = "You sunk computer's Carrier";
    setTimeout(() => {
      infoDisplay.innerHTML = '';
    }, 2000);
    carrierCount = 10;
  }

  if (cpuDestroyerCount === 2) {
    infoDisplay.innerHTML = 'The computer sunk your Destroyer';
    setTimeout(() => {
      infoDisplay.innerHTML = '';
    }, 2000);
    cpuDestroyerCount = 10;
  }
  if (cpuSubmarineCount === 3) {
    infoDisplay.innerHTML = 'The computer sunk your Submarine';
    setTimeout(() => {
      infoDisplay.innerHTML = '';
    }, 2000);
    cpuSubmarineCount = 10;
  }
  if (cpuCruiserCount === 3) {
    infoDisplay.innerHTML = 'The computer sunk your Cruiser';
    setTimeout(() => {
      infoDisplay.innerHTML = '';
    }, 2000);
    cpuCruiserCount = 10;
  }
  if (cpuBattleshipCount === 4) {
    infoDisplay.innerHTML = 'The computer sunk your Battleship';
    setTimeout(() => {
      infoDisplay.innerHTML = '';
    }, 2000);
    cpuBattleshipCount = 10;
  }
  if (cpuCarrierCount === 5) {
    infoDisplay.innerHTML = 'The computer sunk your Carrier';
    setTimeout(() => {
      infoDisplay.innerHTML = '';
    }, 2000);
    cpuCarrierCount = 10;
  }

  if (destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount === 50) {
    turnDisplay.remove();

    document.querySelector('#winners').classList.remove('ocultar');
    document.querySelector('#winners').classList.add('declarateWinner');
    document.querySelector('#winner').innerText = 'YOU WIN';
    infoDisplay.innerHTML = '';
    document.querySelector('.color-mode label div.bx-sun').style.zIndex = 0;
    document.querySelector('.color-mode label div.bx-moon').style.zIndex = 0;
    isGameOver = gameOver();
  }
  if (cpuDestroyerCount + cpuSubmarineCount + cpuCarrierCount + cpuBattleshipCount + cpuCruiserCount === 50) {
    turnDisplay.remove();
    document.querySelector('#winners').classList.remove('ocultar');
    document.querySelector('#winners').classList.add('declarateWinner');
    document.querySelector('#winner').innerText = 'CPU WIN';
    infoDisplay.innerHTML = '';
    document.querySelector('.color-mode label div.bx-sun').style.zIndex = 0;
    document.querySelector('.color-mode label div.bx-moon').style.zIndex = 0;
    isGameOver = gameOver();
  }
}

function gameOver() {
  return true;
}

startButton.addEventListener('click', () => {
  document.querySelector('.home').classList.add('ocultar');
  document.querySelector('.home').classList.remove('home');
  document.querySelector('.game').classList.remove('ocultar');
});