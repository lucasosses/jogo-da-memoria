const emojis = ['🐶','🐱','🐭','🐹','🦊','🐻','🐼','🐨'];
let cards = [...emojis, ...emojis];
let firstCard = null;
let lock = false;
let matches = 0;

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  const board = document.getElementById('gameBoard');
  board.innerHTML = '';
  cards = shuffle(cards);
  matches = 0;
  document.getElementById('status').textContent = '';

  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.textContent = '';
    card.addEventListener('click', handleClick);
    board.appendChild(card);
  });
}

function handleClick(e) {
  if (lock) return;

  const clicked = e.target;
  if (clicked.classList.contains('revealed')) return;

  clicked.textContent = clicked.dataset.emoji;
  clicked.classList.add('revealed');

  if (!firstCard) {
    firstCard = clicked;
  } else {
    if (clicked.dataset.emoji === firstCard.dataset.emoji) {
      firstCard = null;
      matches++;
      if (matches === emojis.length) {
        document.getElementById('status').textContent = 'Você venceu!';
      }
    } else {
      lock = true;
      setTimeout(() => {
        clicked.textContent = '';
        clicked.classList.remove('revealed');
        firstCard.textContent = '';
        firstCard.classList.remove('revealed');
        firstCard = null;
        lock = false;
      }, 1000);
    }
  }
}

document.getElementById('reset').addEventListener('click', createBoard);

createBoard();
