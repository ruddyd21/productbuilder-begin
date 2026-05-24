const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.getElementById('numbers');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = themeToggle.querySelector('.theme-toggle__icon');
const themeToggleText = themeToggle.querySelector('.theme-toggle__text');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

generateBtn.addEventListener('click', () => {
    const numbers = generateLottoNumbers();
    displayNumbers(numbers);
});

themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    setTheme(nextTheme);
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayNumbers(numbers) {
    numbersContainer.innerHTML = '';
    numbers.forEach(number => {
        const numberElement = document.createElement('div');
        numberElement.classList.add('number');
        numberElement.textContent = number;
        numbersContainer.appendChild(numberElement);
    });
}

function setTheme(theme) {
    const isDark = theme === 'dark';

    document.body.classList.toggle('dark-mode', isDark);
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? '화이트 모드로 전환' : '다크 모드로 전환');
    themeToggleIcon.textContent = isDark ? '☀' : '☾';
    themeToggleText.textContent = isDark ? '화이트 모드' : '다크 모드';
    localStorage.setItem('theme', theme);
}
