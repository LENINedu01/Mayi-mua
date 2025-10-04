const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
const boxes = canvasSize / box;

let snake, direction, score, heart, star, game;
const gameOverBox = document.getElementById("gameOverBox");
const gameOverText = document.getElementById("gameOverText");
const retryBtn = document.getElementById("retryBtn");

function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  star = null;
  heart = randomPosition();
  document.getElementById("score").innerText = score;
  gameOverBox.classList.add("hidden");

  // 🚫 Bloquea scroll mientras se juega
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";

  clearInterval(game);
  game = setInterval(draw, 120);
}

function randomPosition() {
  return {
    x: Math.floor(Math.random() * boxes) * box,
    y: Math.floor(Math.random() * boxes) * box,
  };
}

document.addEventListener("keydown", directionHandler);
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);
retryBtn.addEventListener("click", initGame);

let xDown = null;
let yDown = null;

function directionHandler(e) {
  e.preventDefault();
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function handleTouchStart(evt) {
  const firstTouch = evt.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) return;

  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;
  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0 && direction !== "RIGHT") direction = "LEFT";
    else if (xDiff < 0 && direction !== "LEFT") direction = "RIGHT";
  } else {
    if (yDiff > 0 && direction !== "DOWN") direction = "UP";
    else if (yDiff < 0 && direction !== "UP") direction = "DOWN";
  }

  xDown = null;
  yDown = null;
}

function drawHeart(x, y) {
  ctx.font = "20px Arial";
  ctx.fillText("💖", x, y + 15);
}

function drawStar(x, y) {
  ctx.font = "20px Arial";
  ctx.fillText("⭐", x + 3, y + 15);
}

function draw() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#8b1a3a";
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    const x = snake[i].x;
    const y = snake[i].y;
    const grad = ctx.createRadialGradient(
      x + box / 2,
      y + box / 2,
      5,
      x + box / 2,
      y + box / 2,
      box / 1.2
    );
    if (i === 0) {
      grad.addColorStop(0, "#ff4d88");
      grad.addColorStop(1, "#cc3366");
    } else {
      grad.addColorStop(0, "#ffd6e8");
      grad.addColorStop(1, "#ffb6c1");
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, box, box, 6);
    ctx.fill();
  }

  ctx.font = `${box * 0.9}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("💖", heart.x + box / 2, heart.y + box / 2);

  if (star) drawStar(star.x, star.y);

  ctx.fillStyle = "#cc3366";
  ctx.font = "20px Arial";
  ctx.fillText("Puntaje: " + score, box, 30);

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  if (headX === heart.x && headY === heart.y) {
    score++;
    document.getElementById("score").innerText = score;
    heart = randomPosition();

    if (score === 20 && !star) star = randomPosition();
  } else if (star && headX === star.x && headY === star.y) {
    score++;
    clearInterval(game);
    gameOverText.textContent = `🏆 ¡Ganaste 1 estrella reclama tomando captura y con ${score} puntos!`;
    gameOverBox.classList.remove("hidden");

    // ✅ Reactiva scroll
    document.body.style.overflow = "auto";
    document.body.style.touchAction = "auto";
    return;
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvasSize ||
    headY >= canvasSize ||
    snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
  ) {
    clearInterval(game);
    gameOverText.textContent = `💔 Fin del juego... ¡Tu amor creció ${score} veces!`;
    gameOverBox.classList.remove("hidden");

    // ✅ Reactiva scroll al perder
    document.body.style.overflow = "auto";
    document.body.style.touchAction = "auto";
    return;
  }

  snake.unshift(newHead);
}

// Iniciar al cargar
initGame();
