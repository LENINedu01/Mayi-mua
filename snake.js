const canvas = document.getElementById("snake");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let direction = null;
let food = randomFood();
let star = null;
let score = 0;
let game;
let gameRunning = true;

// 🔒 Bloquear scroll al iniciar el juego
document.body.classList.remove("unlocked");

// Dibujar corazones y estrella
function drawHeart(x, y) {
  ctx.fillStyle = "#ff4d6d";
  ctx.beginPath();
  ctx.moveTo(x + box / 2, y + box / 4);
  ctx.bezierCurveTo(x + box / 2, y, x + box, y, x + box, y + box / 4);
  ctx.bezierCurveTo(x + box, y + box / 2, x + box / 2, y + box, x + box / 2, y + box);
  ctx.bezierCurveTo(x + box / 2, y + box, x, y + box / 2, x, y + box / 4);
  ctx.bezierCurveTo(x, y, x + box / 2, y, x + box / 2, y + box / 4);
  ctx.fill();
}

function drawStar(x, y) {
  ctx.fillStyle = "#ffd700";
  ctx.beginPath();
  const outerRadius = box / 2;
  const innerRadius = box / 4;
  const cx = x + box / 2;
  const cy = y + box / 2;
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box,
  };
}

document.addEventListener("keydown", directionHandler);
function directionHandler(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";

  // Evita que se mueva el scroll con las flechas
  event.preventDefault();
}

function drawSnakePart(x, y, isHead = false) {
  if (isHead) {
    ctx.fillStyle = "#cc3366";
    ctx.beginPath();
    ctx.moveTo(x + box / 2, y);
    ctx.lineTo(x + box, y + box);
    ctx.lineTo(x, y + box);
    ctx.closePath();
    ctx.fill();

    // Ojitos 🐍
    ctx.fillStyle = "#000";
    if (direction === "RIGHT") {
      ctx.fillRect(x + box * 0.7, y + box * 0.2, 2, 2);
      ctx.fillRect(x + box * 0.7, y + box * 0.6, 2, 2);
    } else if (direction === "LEFT") {
      ctx.fillRect(x + box * 0.2, y + box * 0.2, 2, 2);
      ctx.fillRect(x + box * 0.2, y + box * 0.6, 2, 2);
    } else if (direction === "UP") {
      ctx.fillRect(x + box * 0.3, y + box * 0.2, 2, 2);
      ctx.fillRect(x + box * 0.7, y + box * 0.2, 2, 2);
    } else if (direction === "DOWN") {
      ctx.fillRect(x + box * 0.3, y + box * 0.7, 2, 2);
      ctx.fillRect(x + box * 0.7, y + box * 0.7, 2, 2);
    }
  } else {
    ctx.fillStyle = "#ffb6c1";
    ctx.fillRect(x, y, box, box);
  }
}

function collision(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x === arr[i].x && head.y === arr[i].y) return true;
  }
  return false;
}

function endGame() {
  clearInterval(game);
  gameRunning = false;

  // 🔓 Desbloquear el scroll cuando termina el juego
  document.body.classList.add("unlocked");

  const retryBtn = document.createElement("button");
  retryBtn.textContent = "Volver a intentar";
  retryBtn.classList.add("retry-btn");
  document.body.appendChild(retryBtn);

  retryBtn.addEventListener("click", () => {
    document.body.removeChild(retryBtn);
    resetGame();
    // 🔒 Bloquear scroll otra vez al reiniciar
    document.body.classList.remove("unlocked");
  });
}

function resetGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  food = randomFood();
  star = null;
  score = 0;
  gameRunning = true;
  game = setInterval(draw, 100);
}

function draw() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🔲 Borde notorio color vino
  ctx.strokeStyle = "#8B0000";
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    drawSnakePart(snake[i].x, snake[i].y, i === 0);
  }

  drawHeart(food.x, food.y);
  if (star) drawStar(star.x, star.y);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = randomFood();

    if (score === 20 && !star) {
      star = randomFood();
    }
  } else if (star && snakeX === star.x && snakeY === star.y) {
    score += 5;
    star = null;
    clearInterval(game);
    alert("🌟 ¡Ganaste 1 estrella!");
    endGame();
    return;
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    endGame();
    return;
  }

  snake.unshift(newHead);

  ctx.fillStyle = "#333";
  ctx.font = "18px Arial";
  ctx.fillText("💖 " + score, box, box);
}

game = setInterval(draw, 100);

