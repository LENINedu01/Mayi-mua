const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
const boxes = canvasSize / box;

let snake, direction, score, heart, star, gotStar;
const gameOverBox = document.getElementById("gameOverBox");
const gameOverText = document.getElementById("gameOverText");
const retryBtn = document.getElementById("retryBtn");

function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  gotStar = false;
  heart = randomPosition();
  star = null;
  document.getElementById("score").innerText = score;
  gameOverBox.classList.add("hidden");
  lastRenderTime = 0;
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", directionHandler);
// 🚫 Evitar que las flechas muevan la página
window.addEventListener("keydown", function(e) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault();
  }
});

canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);
// 🚫 Evita que el deslizamiento táctil mueva la página
canvas.addEventListener("touchmove", function(e) {
  e.preventDefault();
}, { passive: false });

retryBtn.addEventListener("click", initGame);

let xDown = null;
let yDown = null;

function randomPosition() {
  return {
    x: Math.floor(Math.random() * boxes) * box,
    y: Math.floor(Math.random() * boxes) * box
  };
}

function directionHandler(e) {
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

// 💖 Dibuja el corazón
function drawHeart(x, y) {
  ctx.font = `${box * 0.9}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("💖", x + box / 2, y + box / 2);
}

// 🌟 Dibuja la estrella
function drawStar(x, y) {
  ctx.font = `${box * 0.9}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⭐", x + box / 2, y + box / 2);
}

function draw() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🩸 Borde vino
  ctx.strokeStyle = "#8b1a3a";
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // 🐍 Dibuja la serpiente
  for (let i = 0; i < snake.length; i++) {
    const x = snake[i].x;
    const y = snake[i].y;

    if (i === 0) {
      // Cabeza en forma de lanza
      ctx.fillStyle = "#ff4d88";
      ctx.beginPath();
      if (direction === "RIGHT") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + box, y + box / 2);
        ctx.lineTo(x, y + box);
      } else if (direction === "LEFT") {
        ctx.moveTo(x + box, y);
        ctx.lineTo(x, y + box / 2);
        ctx.lineTo(x + box, y + box);
      } else if (direction === "UP") {
        ctx.moveTo(x, y + box);
        ctx.lineTo(x + box / 2, y);
        ctx.lineTo(x + box, y + box);
      } else if (direction === "DOWN") {
        ctx.moveTo(x, y);
        ctx.lineTo(x + box / 2, y + box);
        ctx.lineTo(x + box, y);
      }
      ctx.closePath();
      ctx.fill();

      // Ojitos
      ctx.fillStyle = "#000";
      if (direction === "RIGHT" || direction === "LEFT") {
        ctx.beginPath();
        ctx.arc(x + (direction === "RIGHT" ? box - 6 : 6), y + 5, 2, 0, Math.PI * 2);
        ctx.arc(x + (direction === "RIGHT" ? box - 6 : 6), y + box - 5, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x + 5, y + (direction === "DOWN" ? box - 6 : 6), 2, 0, Math.PI * 2);
        ctx.arc(x + box - 5, y + (direction === "DOWN" ? box - 6 : 6), 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Cuerpo redondeado
      const grad = ctx.createRadialGradient(x + box / 2, y + box / 2, 5, x + box / 2, y + box / 2, box / 1.2);
      grad.addColorStop(0, "#ffd6e8");
      grad.addColorStop(1, "#ffb6c1");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, box, box, 6);
      ctx.fill();
    }
  }

  // ❤️ Corazón
  drawHeart(heart.x, heart.y);

  // 🌟 Si hay estrella, dibujarla
  if (star) drawStar(star.x, star.y);

  // Movimiento
  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // 💖 Comer corazón
  if (headX === heart.x && headY === heart.y) {
    score++;
    document.getElementById("score").innerText = score;
    heart = randomPosition();

    // 🌟 Si llega a 20 puntos, aparece la estrella
    if (score === 20 && !star) {
      star = randomPosition();
    }
  } else if (star && headX === star.x && headY === star.y) {
    // 🌟 Comer estrella
    gotStar = true;
    star = null;
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  // Colisión
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvasSize ||
    headY >= canvasSize ||
    snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
  ) {
    if (gotStar) {
      gameOverText.textContent = `🌟 ¡Ganaste 1 estrella! Toma captura para reclamar (Puntaje: ${score})`;
    } else {
      gameOverText.textContent = `💔 Fin del juego... ¡Tu amor creció ${score} veces!`;
    }
    gameOverBox.classList.remove("hidden");
    return false; // detener juego
  }

  snake.unshift(newHead);
  return true;
}

// 🚀 OPTIMIZACIÓN CON requestAnimationFrame
let lastRenderTime = 0;
const gameSpeed = 8; // controla fluidez

function gameLoop(currentTime) {
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / gameSpeed) {
    requestAnimationFrame(gameLoop);
    return;
  }
  lastRenderTime = currentTime;

  if (draw()) {
    requestAnimationFrame(gameLoop);
  }
}

// 🚀 Iniciar al cargar
initGame();
