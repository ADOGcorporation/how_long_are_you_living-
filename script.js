// Elementos del DOM
const birthdateInput = document.getElementById('birthdate');
const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('results');
const totalText = document.getElementById('totalText');

// Elementos de resultados
const yearsEl = document.getElementById('years');
const monthsEl = document.getElementById('months');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

let intervalId = null;

// Formatear números con separadores de miles
function formatNumber(num) {
    return num.toLocaleString('es-ES');
}

// Calcular diferencia detallada entre dos fechas
function calculateLifeTime(birthDate) {
    const now = new Date();
    
    // Si la fecha de nacimiento es futura
    if (birthDate > now) {
        return null;
    }

    // Cálculo de años, meses y días exactos
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    // Ajustar si los días son negativos
    if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
    }

    // Ajustar si los meses son negativos
    if (months < 0) {
        years--;
        months += 12;
    }

    // Cálculo de horas, minutos y segundos
    const diffMs = now - birthDate;
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Horas, minutos y segundos restantes dentro del día actual
    const remainingHours = now.getHours();
    const remainingMinutes = now.getMinutes();
    const remainingSeconds = now.getSeconds();

    return {
        years,
        months,
        days,
        hours: remainingHours,
        minutes: remainingMinutes,
        seconds: remainingSeconds,
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds
    };
}

// Actualizar la interfaz con los resultados
function updateResults(birthDate) {
    const result = calculateLifeTime(birthDate);

    if (!result) {
        totalText.innerHTML = '⚠️ La fecha de nacimiento no puede ser futura.';
        return;
    }

    // Animación de pulso
    const cards = document.querySelectorAll('.result-card');
    cards.forEach(card => {
        card.classList.remove('pulse');
        void card.offsetWidth; // Forzar reflow
        card.classList.add('pulse');
    });

    // Actualizar valores
    yearsEl.textContent = formatNumber(result.years);
    monthsEl.textContent = formatNumber(result.months);
    daysEl.textContent = formatNumber(result.days);
    hoursEl.textContent = formatNumber(result.hours);
    minutesEl.textContent = formatNumber(result.minutes);
    secondsEl.textContent = formatNumber(result.seconds);

    // Resumen total
    totalText.innerHTML = `
        Has vivido aproximadamente <strong>${formatNumber(result.totalDays)}</strong> días, 
        <strong>${formatNumber(result.totalHours)}</strong> horas, 
        <strong>${formatNumber(result.totalMinutes)}</strong> minutos y 
        <strong>${formatNumber(result.totalSeconds)}</strong> segundos.
    `;
}

// Iniciar el contador en tiempo real
function startCounter(birthDate) {
    if (intervalId) {
        clearInterval(intervalId);
    }
    updateResults(birthDate);
    intervalId = setInterval(() => updateResults(birthDate), 1000);
}

// Validar y calcular
function handleCalculate() {
    const value = birthdateInput.value;
    
    if (!value) {
        totalText.innerHTML = '⚠️ Por favor, selecciona una fecha de nacimiento.';
        return;
    }

    const birthDate = new Date(value + 'T00:00:00');
    const now = new Date();

    if (birthDate > now) {
        totalText.innerHTML = '⚠️ La fecha de nacimiento no puede ser futura.';
        return;
    }

    startCounter(birthDate);
}

// Event listeners
calculateBtn.addEventListener('click', handleCalculate);

birthdateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleCalculate();
    }
});

// Establecer fecha máxima como hoy
const today = new Date().toISOString().split('T')[0];
birthdateInput.setAttribute('max', today);
