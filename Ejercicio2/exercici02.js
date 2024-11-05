let countdown;
let activeWindows = 0;
let totalCreatedWindows = 0;
let lastGameWon = false;
let lastClickedColor = null;
let lastClickedWindow = null;
let windowInterval; // Intervalo para abrir ventanas

const colors = ['red', 'green', 'blue', 'yellow'];

window.onload = function() {
    const lastTotalWindows = localStorage.getItem('totalCreatedWindows') || 0;
    const lastGameStatus = localStorage.getItem('lastGameWon') === 'true' ? 'Guanyada' : 'No guanyada';
    
    document.getElementById('createdWindowsMessage').innerHTML = `Total de finestres creades en la última partida: ${lastTotalWindows}`;
    document.getElementById('message').innerHTML = `Última partida: ${lastGameStatus}`;
};

document.getElementById('startButton').addEventListener('click', function() {
    startGame();
});

document.getElementById('endGameButton').addEventListener('click', function() {
    clearInterval(countdown);
    clearInterval(windowInterval); // Detener el intervalo de ventanas
    document.getElementById('message').innerHTML = "Has finalitzat el joc.";
    localStorage.setItem('totalCreatedWindows', totalCreatedWindows);
    localStorage.setItem('lastGameWon', lastGameWon);
});

document.getElementById('restartButton').addEventListener('click', function() {
    restartGame();
});

function startGame() {
    activeWindows = 0;
    totalCreatedWindows = 0;
    lastGameWon = false;
    lastClickedColor = null;
    lastClickedWindow = null;
    document.getElementById('message').innerHTML = '';
    
    let timeLeft = 30; // 30 seconds countdown
    document.getElementById('countdown').innerHTML = timeLeft;

    countdown = setInterval(() => {
        timeLeft--;
        document.getElementById('countdown').innerHTML = timeLeft;

        if (timeLeft === 0) {
            clearInterval(countdown);
            clearInterval(windowInterval); // Asegurarse de detener el intervalo de ventanas
            endGame(false);
        }
    }, 1000);

    // Abre 7 ventanas de inmediato
    for (let i = 0; i < 7; i++) {
        openRandomWindow();
    }

    // Abre la primera ventana en el centro
    openCenteredWindow();

    // Abre una nueva ventana cada 3 segundos a partir del segundo 26
    windowInterval = setInterval(() => {
        if (timeLeft > 0) { // Solo abrir si hay tiempo restante
            openRandomWindow();
        }
    }, 3000);
    
    setTimeout(() => {
        // Este intervalo se inicia después de 26 segundos
        windowInterval = setInterval(() => {
            if (timeLeft > 0) {
                openRandomWindow();
            }
        }, 3000);
    }, 26000); // 26 segundos
}

function openCenteredWindow() {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const width = 300;
    const height = 200;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    
    const newWindow = window.open('', '', `width=${width},height=${height},top=${top},left=${left}`);
    
    newWindow.document.write(`<body style="background-color: ${color};"><h1>${color}</h1></body>`);
    newWindow.document.close();

    newWindow.onclick = function() {
        handleWindowClick(newWindow, color);
    };

    activeWindows++;
    totalCreatedWindows++;
    document.getElementById('createdWindowsMessage').innerHTML = `Total de finestres creades: ${totalCreatedWindows}`;
}

function openRandomWindow() {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const width = 300;
    const height = 200;

    // Generar posiciones aleatorias
    const left = Math.floor(Math.random() * (window.innerWidth - width));
    const top = Math.floor(Math.random() * (window.innerHeight - height));
    
    const newWindow = window.open('', '', `width=${width},height=${height},top=${top},left=${left}`);
    
    newWindow.document.write(`<body style="background-color: ${color};"><h1>${color}</h1></body>`);
    newWindow.document.close();

    newWindow.onclick = function() {
        handleWindowClick(newWindow, color);
    };

    activeWindows++;
    totalCreatedWindows++;
    document.getElementById('createdWindowsMessage').innerHTML = `Total de finestres creades: ${totalCreatedWindows}`;

    // Terminar el juego si queda una sola ventana
    if (activeWindows === 1) {
        endGame(true);
    }
}

function handleWindowClick(windowRef, color) {
    if (lastClickedColor === color && lastClickedWindow === windowRef) {
        // Si es la misma ventana, cambia el color
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        windowRef.document.body.style.backgroundColor = newColor;
        windowRef.document.querySelector('h1').innerText = newColor; // Cambiar el texto
        lastClickedColor = newColor; // Actualizar el color
        lastClickedWindow = windowRef; // Actualizar la ventana clicada
    } else if (lastClickedColor === color) {
        // Si el color es el mismo pero la ventana es diferente, cerrar ambas
        windowRef.close();
        lastClickedWindow.close();
        activeWindows -= 2; // Disminuir por ambas ventanas cerradas
        lastClickedColor = null; // Reiniciar el color clicado
        lastClickedWindow = null; // Reiniciar la ventana clicada
    } else {
        // Si el color es diferente, solo actualizar el color clicado
        lastClickedColor = color; // Actualizar el color clicado
        lastClickedWindow = windowRef; // Actualizar la ventana clicada
    }

    // Comprobar si quedan ventanas activas
    if (activeWindows <= 0) {
        endGame(true);
    }
}

function endGame(won) {
    clearInterval(countdown);
    clearInterval(windowInterval); // Detener el intervalo de ventanas
    if (won) {
        document.getElementById('message').innerHTML = "Enhorabona! Has guanyat!";
        lastGameWon = true;
    } else {
        document.getElementById('message').innerHTML = "No has guanyat, però pots tornar-ho a intentar.";
    }
    localStorage.setItem('totalCreatedWindows', totalCreatedWindows);
    localStorage.setItem('lastGameWon', lastGameWon);
    document.getElementById('endGameButton').style.display = 'block';
    document.getElementById('restartButton').style.display = 'block'; // Mostrar el botón de reinicio
    document.getElementById('startButton').style.display = 'none'; // Ocultar el botón de inicio
}

function restartGame() {
    // Reiniciar todas las variables y el estado del juego
    activeWindows = 0;
    totalCreatedWindows = 0;
    lastGameWon = false;
    lastClickedColor = null;
    lastClickedWindow = null;

    // Reiniciar el mensaje y el conteo
    document.getElementById('message').innerHTML = '';
    document.getElementById('createdWindowsMessage').innerHTML = `Total de finestres creades: 0`;
    document.getElementById('countdown').innerHTML = '';

    // Reiniciar los botones
    document.getElementById('endGameButton').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';

    // Volver a mostrar el botón de inicio
    document.getElementById('startButton').style.display = 'block';
}
