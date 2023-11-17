// Color Mode Changer (betweem Light Mode <-> Dark Mode):
function toggleDarkMode() {
    // Dark Color Characteristics:
    var btn1 = document.getElementById("start");
    var btn2 = document.getElementById("rotate");
    var btn3 = document.getElementById("playAgain");
    var btn3b = document.querySelector(".playAgain");
    var gameBoard = document.getElementById("game-board");
    gameBoard.classList.toggle("dark-mode");
    btn1.classList.toggle("dark-mode");
    btn2.classList.toggle("dark-mode");
    btn3.classList.toggle("dark-mode");
    btn3b.classList.toggle("dark-mode");
}

// Battleship Gameplay:
document.addEventListener('DOMContentLoaded', () => {
  const userGrid = document.querySelector('.grid-user');
  const computerGrid = document.querySelector('.grid-computer');
  const displayGrid = document.querySelector('.grid-display');
  const ships = document.querySelectorAll('.ship');
  const destroyer = document.querySelector('.destroyer-container');
  const submarine = document.querySelector('.submarine-container');
  const cruiser = document.querySelector('.cruiser-container');
  const battleship = document.querySelector('.battleship-container');
  const carrier = document.querySelector('.carrier-container');
  const startButton = document.querySelector('#start');
  const rotateButton = document.querySelector('#rotate');
  const playAgainButton = document.querySelector('#playAgain');
  const turnDisplay = document.querySelector('#whose-go');
  const infoDisplay = document.querySelector('#info');
  const setupButtons = document.getElementById('setup-buttons');
  const userSquares = [];
  const computerSquares = [];
  let isHorizontal = true;
  let isGameOver = false;
  let currentPlayer = 'user';
  const width = 10;
  let playerNum = 0;
  let ready = false;
  let enemyReady = false;
  let allShipsPlaced = false;
  let shotFired = -1;
  let gameMode = 'singlePlayer' // singlePlayer Mode.
  // Game Ships:
  const shipArray = [
    {
      name: 'destroyer',
      directions: [
        [0, 1],
        [0, width]
      ]
    },
    {
      name: 'submarine',
      directions: [
        [0, 1, 2],
        [0, width, width * 2]
      ]
    },
    {
      name: 'cruiser',
      directions: [
        [0, 1, 2],
        [0, width, width * 2]
      ]
    },
    {
      name: 'battleship',
      directions: [
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3]
      ]
    },
    {
      name: 'carrier',
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width * 2, width * 3, width * 4]
      ]
    },
  ];

  createBoard(userGrid, userSquares);
  createBoard(computerGrid, computerSquares);

  // Calling the correct Game Mode - Function:
  if (gameMode === 'singlePlayer') {
    startSinglePlayer();
  } else {
    startMultiPlayer();
  }

  // Single Player - Function:
  function startSinglePlayer() {
    generate(shipArray[0]);
    generate(shipArray[1]);
    generate(shipArray[2]);
    generate(shipArray[3]);
    generate(shipArray[4]);

    startButton.addEventListener('click', () => {
      setupButtons.style.display = 'none';
      infoDisplay.innerHTML = '';
      playGameSingle();
    });
  }

  // Create Board - Function:
  function createBoard(grid, squares) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.dataset.id = i;
      grid.appendChild(square);
      squares.push(square);
    }
  }

  // Place the computer's ships in random locations - Function:
  function generate(ship) {
    let randomDirection = Math.floor(Math.random() * ship.directions.length);
    let current = ship.directions[randomDirection];
    if (randomDirection === 0) direction = 1;
    if (randomDirection === 1) direction = 10;
    let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)));

    const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'));
    const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1);
    const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0);

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name));
    else generate(ship);
  }

  // Rotate Your ships - Function:
  function rotate() {
    if (isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical');
      submarine.classList.toggle('submarine-container-vertical');
      cruiser.classList.toggle('cruiser-container-vertical');
      battleship.classList.toggle('battleship-container-vertical');
      carrier.classList.toggle('carrier-container-vertical');
      isHorizontal = false;
      return;
    }
    if (!isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical');
      submarine.classList.toggle('submarine-container-vertical');
      cruiser.classList.toggle('cruiser-container-vertical');
      battleship.classList.toggle('battleship-container-vertical');
      carrier.classList.toggle('carrier-container-vertical');
      isHorizontal = true;
      return;
    }
  }
  rotateButton.addEventListener('click', rotate);

  // Moving around user's ships:
  ships.forEach(ship => ship.addEventListener('dragstart', dragStart));
  userSquares.forEach(square => square.addEventListener('dragstart', dragStart));
  userSquares.forEach(square => square.addEventListener('dragover', dragOver));
  userSquares.forEach(square => square.addEventListener('dragenter', dragEnter));
  userSquares.forEach(square => square.addEventListener('dragleave', dragLeave));
  userSquares.forEach(square => square.addEventListener('drop', dragDrop));
  userSquares.forEach(square => square.addEventListener('dragend', dragEnd));

  let selectedShipNameWithIndex;
  let draggedShip;
  let draggedShipLength;

  ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
    selectedShipNameWithIndex = e.target.id;
  }));

  function dragStart() {
    draggedShip = this;
    draggedShipLength = this.childNodes.length;
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dragEnter(e) {
    e.preventDefault();
  }

  function dragLeave() {
    // console.log('drag leave')
  }

  function dragDrop() {
    let shipNameWithLastId = draggedShip.lastChild.id;
    let shipClass = shipNameWithLastId.slice(0, -2);

    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
    let shipLastId = lastShipIndex + parseInt(this.dataset.id);

    const notAllowedHorizontal = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 1, 11, 21, 31, 41, 51, 61, 71, 81, 91, 2, 22, 32, 42, 52, 62, 72, 82, 92, 3, 13, 23, 33, 43, 53, 63, 73, 83, 93];
    const notAllowedVertical = [99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60];

    let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
    let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);

    selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

    shipLastId = shipLastId - selectedShipIndex;

    if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
      for (let i = 0; i < draggedShipLength; i++) {
        let directionClass;
        if (i === 0) directionClass = 'start';
        if (i === draggedShipLength - 1) directionClass = 'end';
        userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', 'horizontal', directionClass, shipClass);
      }
      //As long as the index of the ship you are dragging is not in the newNotAllowedVertical array! This means that sometimes if you drag the ship by its
      //index-1 , index-2 and so on, the ship will rebound back to the displayGrid.
    } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
      for (let i = 0; i < draggedShipLength; i++) {
        let directionClass;
        if (i === 0) directionClass = 'start';
        if (i === draggedShipLength - 1) directionClass = 'end';
        userSquares[parseInt(this.dataset.id) - selectedShipIndex + width * i].classList.add('taken', 'vertical', directionClass, shipClass);
      }
    } else return;

    displayGrid.removeChild(draggedShip);
    if(!displayGrid.querySelector('.ship')) {
      allShipsPlaced = true; // All Ships are Placed.
      startButton.disabled = false; // Enabling startButton.
      infoDisplay.innerHTML = 'All Ships are placed! You can now Start a Battle!'; // Message for Start Battle.
    }
  }

  function dragEnd() {
    // console.log('dragend')
  }

  // Game Logic for Single Player - Function:
  function playGameSingle() {
    if (isGameOver) return;
    if (currentPlayer === 'user') {
      turnDisplay.innerHTML = 'Your Turn';
      computerSquares.forEach(square => square.addEventListener('click', function (e) {
        shotFired = square.dataset.id;
        revealSquare(square.classList);
      }));
    }
    if (currentPlayer === 'enemy') {
      turnDisplay.innerHTML = "Computer's Turn";
      setTimeout(enemyGo, 1000);
    }
  }

  let destroyerCount = 0;
  let submarineCount = 0;
  let cruiserCount = 0;
  let battleshipCount = 0;
  let carrierCount = 0;

  function revealSquare(classList) {
    const enemySquare = computerGrid.querySelector(`div[data-id='${shotFired}']`);
    const obj = Object.values(classList);
    if (!enemySquare.classList.contains('boom') && currentPlayer === 'user' && !isGameOver) {
      if (obj.includes('destroyer')) destroyerCount++;
      if (obj.includes('submarine')) submarineCount++;
      if (obj.includes('cruiser')) cruiserCount++;
      if (obj.includes('battleship')) battleshipCount++;
      if (obj.includes('carrier')) carrierCount++;
    }
    if (obj.includes('taken')) {
      enemySquare.classList.add('boom');
    } else {
      enemySquare.classList.add('miss');
    }
    checkForWins();
    currentPlayer = 'enemy';
    if(gameMode === 'singlePlayer') playGameSingle();
  }

  let cpuDestroyerCount = 0;
  let cpuSubmarineCount = 0;
  let cpuCruiserCount = 0;
  let cpuBattleshipCount = 0;
  let cpuCarrierCount = 0;

  function enemyGo(square) {
    if (gameMode === 'singlePlayer') square = Math.floor(Math.random() * userSquares.length);
    if (!userSquares[square].classList.contains('boom')) {
      const hit = userSquares[square].classList.contains('taken');
      userSquares[square].classList.add(hit ? 'boom' : 'miss');
      if (userSquares[square].classList.contains('destroyer')) cpuDestroyerCount++;
      if (userSquares[square].classList.contains('submarine')) cpuSubmarineCount++;
      if (userSquares[square].classList.contains('cruiser')) cpuCruiserCount++;
      if (userSquares[square].classList.contains('battleship')) cpuBattleshipCount++;
      if (userSquares[square].classList.contains('carrier')) cpuCarrierCount++;
      checkForWins();
    } else if (gameMode === 'singlePlayer') enemyGo();
    currentPlayer = 'user';
    turnDisplay.innerHTML = 'Your Turn';
  }

  function checkForWins() {
    let enemy = 'Computer';
    if(gameMode === 'multiPlayer') enemy = 'enemy';
    if (destroyerCount === 2) {
      infoDisplay.innerHTML = `You sunk ${enemy}'s Destroyer`;
      destroyerCount = 10;
    }
    if (submarineCount === 3) {
      infoDisplay.innerHTML = `You sunk ${enemy}'s Submarine`;
      submarineCount = 10;
    }
    if (cruiserCount === 3) {
      infoDisplay.innerHTML = `You sunk ${enemy}'s Cruiser`;
      cruiserCount = 10;
    }
    if (battleshipCount === 4) {
      infoDisplay.innerHTML = `You sunk ${enemy}'s Battleship`;
      battleshipCount = 10;
    }
    if (carrierCount === 5) {
      infoDisplay.innerHTML = `You sunk ${enemy}'s Carrier`;
      carrierCount = 10;
    }
    if (cpuDestroyerCount === 2) {
      infoDisplay.innerHTML = `${enemy} sunk your Destroyer`;
      cpuDestroyerCount = 10;
    }
    if (cpuSubmarineCount === 3) {
      infoDisplay.innerHTML = `${enemy} sunk your Submarine`;
      cpuSubmarineCount = 10;
    }
    if (cpuCruiserCount === 3) {
      infoDisplay.innerHTML = `${enemy} sunk your Cruiser`;
      cpuCruiserCount = 10;
    }
    if (cpuBattleshipCount === 4) {
      infoDisplay.innerHTML = `${enemy} sunk your Battleship`;
      cpuBattleshipCount = 10;
    }
    if (cpuCarrierCount === 5) {
      infoDisplay.innerHTML = `${enemy} sunk your Carrier`;
      cpuCarrierCount = 10;
    }

    if ((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 50) {
      infoDisplay.innerHTML = "YOU WON!";
      turnDisplay.style.display = 'none';
      setupButtons.style.display = 'block';     
      startButton.style.display = 'none';       
      rotateButton.style.display = 'none';    
      playAgainButton.style.display = 'block';  // Appearing playAgainButton.
      gameOver();
    }
    if ((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 50) {
      infoDisplay.innerHTML = `${enemy.toUpperCase()} WINS...`;
      turnDisplay.style.display = 'none';
      setupButtons.style.display = 'block';     
      startButton.style.display = 'none';       
      rotateButton.style.display = 'none';    
      playAgainButton.style.display = 'block';  // Appearing playAgainButton.
      gameOver();
    }
  }

  function gameOver() {
    isGameOver = true;
    startButton.removeEventListener('click', playGameSingle);
  }
});

//Using 'ScrollReveal' by https://github.com/jlmakes/scrollreveal):
//Creating ScrollReveal:
const sr = ScrollReveal({
    distance: '65px',
    duration: 2600,
    delay: 450,
    reset: true
});
//Calling Reveal Methods:
sr.reveal('.color-mode', { delay: 500, origin: 'top' });
sr.reveal('.game-title', { delay: 500, origin: 'top' });
sr.reveal('.game-mode', { delay: 500, origin: 'top' });
sr.reveal('.game-img', { delay: 500, origin: 'top' });
sr.reveal('.grid-user', { delay: 1500, origin: 'left' });
sr.reveal('.grid-computer', { delay: 1500, origin: 'right' }); 
sr.reveal('.setup-buttons', { delay: 2500, origin: 'bottom' });  