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
            endGame(false);
        }
    }, 1000);

    for (let i = 0; i < 7; i++) {
        if (i === 0) {
            openCenteredWindow();
        } else {
            openRandomWindow();
        }
    }

    let newWindowInterval = setInterval(() => {
        if (timeLeft > 0) {
            openRandomWindow();
        } else {
            clearInterval(newWindowInterval);
        }
    }, 3000);
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

    if (activeWindows === 1) {
        endGame(true);
    }
}

function handleWindowClick(windowRef, color) {
    if (lastClickedColor === null) {
        // Primer clic: guarda el color y la referencia de la ventana
        lastClickedColor = color; 
        lastClickedWindow = windowRef; 
    } else if (lastClickedColor === color && lastClickedWindow !== windowRef) {
        // Segundo clic en una ventana de diferente referencia pero con el mismo color, cerrar ambas
        windowRef.close();
        lastClickedWindow.close();
        activeWindows -= 2; 

        // Reiniciar la referencia del último clic
        lastClickedColor = null;
        lastClickedWindow = null;
    } else if (lastClickedColor === color && lastClickedWindow === windowRef) {
        // Mismo color y misma ventana, cambiar el color de la ventana actual
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        windowRef.document.body.style.backgroundColor = newColor;
        windowRef.document.querySelector('h1').innerText = newColor;

        // Actualizar el color y la referencia de la ventana con el nuevo color
        lastClickedColor = newColor;
    } else {
        // Color diferente, actualizamos la referencia y color del último clic
        lastClickedColor = color;
        lastClickedWindow = windowRef;
    }

    // Verificar si quedan ventanas activas
    if (activeWindows <= 0) {
        endGame(true);
    }
}



function endGame(won) {
    clearInterval(countdown);
    clearInterval(windowInterval);
    if (won) {
        document.getElementById('message').innerHTML = "Enhorabona! Has guanyat!";
        lastGameWon = true;
    } else {
        document.getElementById('message').innerHTML = "No has guanyat, però pots tornar-ho a intentar.";
    }
    localStorage.setItem('totalCreatedWindows', totalCreatedWindows);
    localStorage.setItem('lastGameWon', lastGameWon);
    document.getElementById('endGameButton').style.display = 'block';
    document.getElementById('restartButton').style.display = 'block';
    document.getElementById('startButton').style.display = 'none';
}

function restartGame() {
    activeWindows = 0;
    totalCreatedWindows = 0;
    lastGameWon = false;
    lastClickedColor = null;
    lastClickedWindow = null;

    document.getElementById('message').innerHTML = '';
    document.getElementById('createdWindowsMessage').innerHTML = `Total de finestres creades: 0`;
    document.getElementById('countdown').innerHTML = '';

    document.getElementById('endGameButton').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('startButton').style.display = 'block';
}
