let level = 1;
const maxLevel = 10;
const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown', 'cyan', 'magenta', 'lime', 'teal', 'maroon', 'navy'];
let score = 0;
let startTime;
let timerInterval;

function startGame() {
  document.getElementById('instruction-modal').style.display = 'none';
  document.getElementById('final-screen').style.display = 'none';
  document.getElementById('timer-display').textContent = "Time: 0s";
  score = 0;
  level = 1;
  startTime = Date.now();
  startTimer();
  loadLevel();
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timer-display").textContent = `Time: ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function loadLevel() {
  if (level > maxLevel) {
    endGame();
    return;
  }

  document.getElementById('level-display').textContent = `Level: ${level}`;
  document.getElementById('next-level-btn').style.display = 'none';

  const blockContainer = document.getElementById('color-blocks');
  const targetContainer = document.getElementById('color-targets');
  blockContainer.innerHTML = '';
  targetContainer.innerHTML = '';

  // Always limit the number of colors to avoid slicing beyond array length
  const numberOfColors = Math.min(level + 2, colors.length);

  const currentColors = colors.slice(0, numberOfColors);
  const shuffledColors = [...currentColors].sort(() => Math.random() - 0.5);

  shuffledColors.forEach(color => {
    const block = document.createElement('div');
    block.className = 'block';
    block.style.backgroundColor = color;
    block.draggable = true;
    block.dataset.color = color;

    block.addEventListener('dragstart', e => {
      // Prevent dragging if already placed
      if (block.classList.contains('placed')) {
        e.preventDefault();
      } else {
        e.dataTransfer.setData('text/plain', block.dataset.color);
      }
    });

    blockContainer.appendChild(block);
  });

  currentColors.forEach(color => {
    const target = document.createElement('div');
    target.className = 'target';
    target.style.backgroundColor = color;
    target.dataset.color = color;

    target.addEventListener('dragover', e => e.preventDefault());

    target.addEventListener('drop', e => {
      e.preventDefault();
      const draggedColor = e.dataTransfer.getData('text/plain');
      if (draggedColor === target.dataset.color) {
        const draggedBlock = document.querySelector(`.block[data-color="${draggedColor}"]:not(.placed)`);
        if (draggedBlock) {
          draggedBlock.classList.add('placed');
          draggedBlock.style.opacity = '0.5';
          draggedBlock.draggable = false;
          checkLevelComplete();
        }
      }
    });

    targetContainer.appendChild(target);
  });
}

function checkLevelComplete() {
  const placed = document.querySelectorAll('.block.placed');
  const total = Math.min(level + 2, colors.length);

  if (placed.length === total) {
    score++;
    if (level < maxLevel) {
      document.getElementById('next-level-btn').style.display = 'inline-block';
    } else {
      setTimeout(() => endGame(), 800);
    }
  }
}

function nextLevel() {
  level++;
  loadLevel();
}

function endGame() {
  stopTimer();
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById('final-score').textContent = `Final Score: ${score}/${maxLevel}`;
  document.getElementById('final-time').textContent = `Time Taken: ${timeTaken} seconds`;
  document.getElementById('final-screen').style.display = 'flex';
  document.getElementById('next-level-btn').style.display = 'none';
}

function restartGame() {
  startGame();
}
