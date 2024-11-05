document.getElementById('playButton').addEventListener('click', function() {
    // Genera un número aleatorio entre 0 y 10
    const randomNumber = Math.floor(Math.random() * 11);
    const numberDisplay = document.getElementById('numberDisplay');
    
    // Muestra el número en color según su valor
    if (randomNumber < 5) {
        numberDisplay.innerHTML = randomNumber;
        numberDisplay.style.color = 'red';
    } else {
        numberDisplay.innerHTML = randomNumber;
        numberDisplay.style.color = 'green';
    }
    
    // Abre la nueva ventana
    const encertaWindow = window.open('encerta.html', '_blank', 'width=400,height=300');
    
    // Guarda el número en el almacenamiento local
    localStorage.setItem('randomNumber', randomNumber);
    localStorage.setItem('attempts', 0);
});
