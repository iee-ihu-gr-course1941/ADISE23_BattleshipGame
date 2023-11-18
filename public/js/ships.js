// Creating Game Ships (Destroyer, Submarine, Cruiser, Battleship, Carrier).
const width = 10;

const shipss = (name) => {
  let elementHTML;
  let X;
  let Y;
  switch (name) {
    case 'destroyer':
      elementHTML = document.querySelector('.destroyer-container');
      X = [0, 1];
      Y = [0, width];
      break;
    case 'submarine':
      elementHTML = document.querySelector('.submarine-container');
      X = [0, 1, 2];
      Y = [0, width, width * 2];
      break;
    case 'cruiser':
      elementHTML = document.querySelector('.cruiser-container');
      X = [0, 1, 2];
      Y = [0, width, width * 2];
      break;
    case 'battleship':
      elementHTML = document.querySelector('.battleship-container');
      X = [0, 1, 2, 3];
      Y = [0, width, width * 2, width * 3];
      break;
    case 'carrier':
      elementHTML = document.querySelector('.carrier-container');
      X = [0, 1, 2, 3, 4];
      Y = [0, width, width * 2, width * 3, width * 4];
      break;
  }

  const getName = () => name;
  const getElement = () => elementHTML;
  const getDirections = () => {
    return [X, Y];
  };

  return { getName, getElement, getDirections };
};

export { shipss };