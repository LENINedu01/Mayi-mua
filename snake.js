const canvasSize = 400;
const boxes = canvasSize / box;

let snake, direction, score, heart, star, game;
let snake, direction, score, heart, star, gotStar, game;
const gameOverBox = document.getElementById("gameOverBox");
const gameOverText = document.getElementById("gameOverText");
const retryBtn = document.getElementById("retryBtn");

// 🧠 Inicializa el juego
function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  gotStar = false;
  heart = {
    x: Math.floor(Math.random() * boxes) * box,
    y: Math.floor(Math.random() * boxes) * box
  };
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
  // 🚫 Bloquea scroll durante el juego
  document.body.classList.add("no-scroll");

  game = setInterval(draw, 150);
}

document.addEventListener("keydown", directionHandler);
@@ -42,14 +39,19 @@ retryBtn.addEventListener("click", initGame);
let xDown = null;
let yDown = null;

// 🎮 Control de dirección
function directionHandler(e) {
  e.preventDefault();
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // evita que el navegador se desplace
  }

  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// 📱 Control táctil
function handleTouchStart(evt) {
  const firstTouch = evt.touches[0];
  xDown = firstTouch.clientX;
@@ -76,60 +78,100 @@ function handleTouchMove(evt) {
  yDown = null;
}

// 💖 Dibuja el corazón
function drawHeart(x, y) {
  ctx.font = "20px Arial";
  ctx.fillText("💖", x, y + 15);
  ctx.font = `${box * 0.9}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("💖", x + box / 2, y + box / 2);
}

// 🌟 Dibuja la estrella
function drawStar(x, y) {
  ctx.font = "20px Arial";
  ctx.fillText("⭐", x + 3, y + 15);
  ctx.font = `${box * 0.9}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⭐", x + box / 2, y + box / 2);
}

// 🐍 Dibuja todo el juego
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
      // Cabeza tipo lanza
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

      // 👀 Ojitos
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
      // Cuerpo con gradiente suave
      const grad = ctx.createRadialGradient(
        x + box / 2,
        y + box / 2,
        5,
        x + box / 2,
        y + box / 2,
        box / 1.2
      );
      grad.addColorStop(0, "#ffd6e8");
      grad.addColorStop(1, "#ffb6c1");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, box, box, 6);
      ctx.fill();
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
  // ❤️ Corazón
  drawHeart(heart.x, heart.y);

  // 🌟 Estrella si existe
  if (star) drawStar(star.x, star.y);

  ctx.fillStyle = "#cc3366";
  ctx.font = "20px Arial";
  ctx.fillText("Puntaje: " + score, box, 30);

  // Movimiento
  let headX = snake[0].x;
  let headY = snake[0].y;

@@ -138,47 +180,55 @@ function draw() {
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Comer corazón
  if (headX === heart.x && headY === heart.y) {
    score++;
    document.getElementById("score").innerText = score;
    heart = randomPosition();

    if (score === 20 && !star) star = randomPosition();
    heart = {
      x: Math.floor(Math.random() * boxes) * box,
      y: Math.floor(Math.random() * boxes) * box
    };

    // 🌟 Aparece estrella al llegar a 20
    if (score === 20 && !star) {
      star = {
        x: Math.floor(Math.random() * boxes) * box,
        y: Math.floor(Math.random() * boxes) * box
      };
    }
  } else if (star && headX === star.x && headY === star.y) {
    score++;
    clearInterval(game);
    gameOverText.textContent = `🏆 ¡Ganaste 1 estrella reclama tomando captura y con ${score} puntos!`;
    gameOverBox.classList.remove("hidden");

    // ✅ Reactiva scroll
    document.body.style.overflow = "auto";
    document.body.style.touchAction = "auto";
    return;
    gotStar = true;
    star = null;
  } else {
    snake.pop();
  }

  const newHead = { x: headX, y: headY };

  // 💥 Colisión
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvasSize ||
    headY >= canvasSize ||
    snake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
    snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)
  ) {
    clearInterval(game);
    gameOverText.textContent = `💔 Fin del juego... ¡Tu amor creció ${score} veces!`;
    gameOverBox.classList.remove("hidden");

    // ✅ Reactiva scroll al perder
    document.body.style.overflow = "auto";
    document.body.style.touchAction = "auto";
    // ✅ Desbloquea scroll al terminar
    document.body.classList.remove("no-scroll");

    if (gotStar) {
      gameOverText.textContent = `🌟 ¡Ganaste 1 estrella!reclam con captura (Puntaje: ${score})`;
    } else {
      gameOverText.textContent = `💔 Fin del juego... ¡Tu amor creció ${score} veces!`;
    }
    gameOverBox.classList.remove("hidden");
    return;
  }

  snake.unshift(newHead);
}

// Iniciar al cargar
// 🚀 Inicia el juego
initGame();
