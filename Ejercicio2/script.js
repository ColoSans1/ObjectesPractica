let countdown, activeWindows = 0, totalCreatedWindows = 0, lastGameWon = false;
let lastClickedColor = null, lastClickedWindow = null;
const colors = ['red', 'green', 'blue', 'yellow'];

window.onload = function() {
    const lastTotalWindows = localStorage.getItem('totalCreatedWindows') || 0;
    const lastGameStatus = localStorage.getItem('lastGameWon') === 'true' ? 'Guanyada' : 'No guanyada';
    document.getElementById('createdWindowsMessage').innerHTML = `Total de finestres creades en la última partida: ${lastTotalWindows}`;
    document.getElementById('message').innerHTML = `Última partida: ${lastGameStatus}`;
};

document.getElementById('startButton').onclick = startGame;
document.getElementById('endGameButton').onclick = () => endGame(false);
document.getElementById('restartButton').onclick = restartGame;

function startGame() {
    resetGame();
    let timeLeft = 30;
    document.getElementById('countdown').innerHTML = timeLeft;

    countdown = setInterval(() => {
        document.getElementById('countdown').innerHTML = --timeLeft;
        if (timeLeft === 0) endGame(false);
    }, 1000);

    for (let i = 0; i < 7; i++) {
        i === 0 ? openWindow(true) : openWindow();
    }

    setInterval(() => openWindow(), 3000);
}

function openWindow(center = false) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const [width, height] = [300, 200];
    const left = center ? (window.innerWidth / 2) - (width / 2) : Math.random() * (window.innerWidth - width);
    const top = center ? (window.innerHeight / 2) - (height / 2) : Math.random() * (window.innerHeight - height);
    
    const newWindow = window.open('', '', `width=${width},height=${height},top=${top},left=${left}`);
    newWindow.document.write(`<body style="background-color: ${color};"><h1>${color}</h1></body>`);

    // Almacenar el color dentro de la ventana
    newWindow.color = color;  // Guardamos el color en una propiedad personalizada

    // Detectar el clic normal y el doble clic
    newWindow.onclick = () => handleWindowClick(newWindow);
    
    // Evento de doble clic para cambiar el color de la ventana
    newWindow.ondblclick = () => changeWindowColor(newWindow);

    activeWindows++;
    totalCreatedWindows++;
    document.getElementById('createdWindowsMessage').innerHTML = `Total de finestres creades: ${totalCreatedWindows}`;
}

// Función para cambiar el color de la ventana al hacer doble clic
function changeWindowColor(windowRef) {
    // Elegir un nuevo color aleatorio
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Cambiar el color de fondo de la ventana
    windowRef.document.body.style.backgroundColor = newColor;
    windowRef.document.querySelector('h1').textContent = newColor; // Actualizar el texto del color en el título
    
    // Actualizar el color de la ventana
    windowRef.color = newColor;
}



function handleWindowClick(windowRef) {
    const clickedColor = windowRef.color;  // Obtener el color actual de la ventana
    if (lastClickedColor && lastClickedColor === clickedColor && lastClickedWindow !== windowRef) {
        windowRef.close();
        lastClickedWindow.close();
        activeWindows -= 2;
        lastClickedColor = lastClickedWindow = null;
    } else {
        lastClickedColor = clickedColor;
        lastClickedWindow = windowRef;
    }

    // Si queda solo una ventana abierta, termina el juego automáticamente como ganado.
    checkRemainingWindows();
}

function endGame(won) {
    clearInterval(countdown);
    document.getElementById('message').innerHTML = won ? "Enhorabona! Has guanyat!" : "No has guanyat, però pots tornar-ho a intentar.";
    localStorage.setItem('totalCreatedWindows', totalCreatedWindows);
    localStorage.setItem('lastGameWon', won);
    toggleButtons();
}

function restartGame() {
    resetGame();
    toggleButtons(false);
}

function resetGame() {
    activeWindows = totalCreatedWindows = 0;
    lastClickedColor = lastClickedWindow = null;
    document.getElementById('createdWindowsMessage').innerHTML = "Total de finestres creades: 0";
    document.getElementById('countdown').innerHTML = '';
    document.getElementById('message').innerHTML = '';
}

function toggleButtons(gameOver = true) {
    document.getElementById('endGameButton').style.display = gameOver ? 'block' : 'none';
    document.getElementById('restartButton').style.display = gameOver ? 'block' : 'none';
    document.getElementById('startButton').style.display = gameOver ? 'none' : 'block';
}
