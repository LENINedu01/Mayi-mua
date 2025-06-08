function checkPassword() {
  const passwordInput = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");
  const correctPassword = "02.06.25"; // reemplaza con tu clave real

  if (passwordInput === correctPassword) {
    errorMsg.textContent = "";
    launchHearts(); // 💘 Mostrar corazones

    setTimeout(() => {
      window.location.href = "menu.html";
    }, 2000);
  } else {
    errorMsg.textContent = "¡Ups! Esa no es la contraseña 😢";
  }
}

function launchHearts() {
  for (let i = 0; i < 30; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = "💖"; // 👈 MUY IMPORTANTE: esto es lo que se verá
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = `${Math.random() * 20 + 20}px`;
    heart.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 2000);
  }
}
