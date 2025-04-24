let level = 1;
const maxLevel = 10;
const colors = ['red', 'brown','green', 'blue', 'yellow', 'orange', 'purple','black','grey','sky blue','pink'];

function startGame() {
  document.getElementById('instruction-modal').style.display = 'none';
  loadLevel();
}

function loadLevel() {
  const levelDisplay = document.getElementById('level-display');
  const blockContainer = document.getElementById('color-blocks');
  const targetContainer = document.getElementById('color-targets');
  const nextBtn = document.getElementById('next-level-btn');

  levelDisplay.textContent = `Level: ${level}`;
  blockContainer.innerHTML = '';
  targetContainer.innerHTML = '';
  nextBtn.style.display = 'none';

  const currentColors = colors.slice(0, level + 2); // level 1 = 3 colors

  // Create shuffled blocks
  const shuffled = [...currentColors].sort(() => Math.random() - 0.5);
  shuffled.forEach(color => {
    const block = document.createElement('div');
    block.className = 'block';
    block.style.backgroundColor = color;
    block.draggable = true;
    block.dataset.color = color;

    block.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', block.dataset.color);
    });

    blockContainer.appendChild(block);
  });

  // Create matching targets
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
        const draggedBlock = document.querySelector(`.block[data-color="${draggedColor}"]`);
        if (draggedBlock && !draggedBlock.classList.contains('placed')) {
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
  const total = level + 2;
  if (placed.length === total) {
    if (level === maxLevel) {
      document.getElementById('final-screen').style.display = 'flex';
    } else {
      document.getElementById('next-level-btn').style.display = 'inline-block';
    }
  }
}

function nextLevel() {
  level++;
  loadLevel();
}

function restartGame() {
  level = 1;
  document.getElementById('final-screen').style.display = 'none';
  loadLevel();
}
