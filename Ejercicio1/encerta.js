let attempts = parseInt(localStorage.getItem('attempts'), 10) + 1;
localStorage.setItem('attempts', attempts);

document.getElementById('compareButton').addEventListener('click', function() {
    const userNumber = parseInt(document.getElementById('inputNumber').value, 10);
    const randomNumber = parseInt(localStorage.getItem('randomNumber'), 10);
    const resultMessage = document.getElementById('resultMessage');

    if (userNumber === randomNumber) {
        resultMessage.innerHTML = "Has encertat el número!";
        // Tancar la finestra des de exercici02.html
        window.close();
        localStorage.setItem('lastAttempt', 'encertat');
    } else {
        resultMessage.innerHTML = "No has encertat el número. Era " + randomNumber;
        localStorage.setItem('lastAttempt', 'no encertat');
    }
});

// Tancar la finestra després de 7 segons
setTimeout(() => {
    window.close();
}, 7000);

// Mostrar si s'ha encertat o no en l'últim intent
window.onload = function() {
    const lastAttempt = localStorage.getItem('lastAttempt');
    if (lastAttempt) {
        alert("Últim intent: " + lastAttempt);
    }
};
