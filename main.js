const HISTORY_KEY = 'lottoHistory';
const MAX_HISTORY = 8;
const PRIZE_ODDS = 8145060;
const RANGES = [
    { label: '1-10', min: 1, max: 10 },
    { label: '11-20', min: 11, max: 20 },
    { label: '21-30', min: 21, max: 30 },
    { label: '31-40', min: 31, max: 40 },
    { label: '41-45', min: 41, max: 45 },
];

const generateBtn = document.getElementById('generate-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const numbersContainer = document.getElementById('numbers');
const drawTime = document.getElementById('draw-time');
const historyList = document.getElementById('history-list');
const historyCount = document.getElementById('history-count');
const sumStat = document.getElementById('sum-stat');
const oddEvenStat = document.getElementById('odd-even-stat');
const rangeStats = document.getElementById('range-stats');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = themeToggle.querySelector('.theme-toggle__icon');
const themeToggleText = themeToggle.querySelector('.theme-toggle__text');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

let history = loadHistory();

setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
displayNumbers(null);
renderHistory();
updateStats(null);

generateBtn.addEventListener('click', () => {
    const numbers = generateLottoNumbers();
    const createdAt = new Date();

    displayNumbers(numbers);
    updateStats(numbers);
    drawTime.textContent = formatTime(createdAt);
    saveHistory(numbers, createdAt);
});

clearHistoryBtn.addEventListener('click', () => {
    history = [];
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
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

    if (!numbers) {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-state';
        emptyState.textContent = '번호 생성을 누르면 6개 번호가 표시됩니다';
        numbersContainer.appendChild(emptyState);
        return;
    }

    numbers.forEach(number => {
        numbersContainer.appendChild(createBall(number));
    });
}

function saveHistory(numbers, createdAt) {
    history = [
        { numbers, createdAt: createdAt.toISOString() },
        ...history,
    ].slice(0, MAX_HISTORY);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    historyCount.textContent = `${history.length}개`;

    if (history.length === 0) {
        const emptyState = document.createElement('p');
        emptyState.className = 'empty-state';
        emptyState.textContent = '최근 생성한 번호가 여기에 저장됩니다';
        historyList.appendChild(emptyState);
        return;
    }

    history.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';

        const meta = document.createElement('div');
        meta.className = 'history-meta';
        meta.textContent = index === 0 ? '방금 전' : formatShortTime(entry.createdAt);

        const balls = document.createElement('div');
        balls.className = 'history-balls';
        entry.numbers.forEach(number => balls.appendChild(createBall(number)));

        item.append(meta, balls);
        historyList.appendChild(item);
    });
}

function updateStats(numbers) {
    if (!numbers) {
        sumStat.textContent = '-';
        oddEvenStat.textContent = '-';
        renderRangeStats([]);
        return;
    }

    const sum = numbers.reduce((total, number) => total + number, 0);
    const oddCount = numbers.filter(number => number % 2 === 1).length;

    sumStat.textContent = `${sum}`;
    oddEvenStat.textContent = `홀 ${oddCount} / 짝 ${6 - oddCount}`;
    renderRangeStats(numbers);
}

function renderRangeStats(numbers) {
    rangeStats.innerHTML = '';

    RANGES.forEach(range => {
        const count = numbers.filter(number => number >= range.min && number <= range.max).length;
        const item = document.createElement('div');
        item.className = 'range-item';
        item.innerHTML = `
            <span>${range.label}</span>
            <span class="range-bar"><span style="width: ${(count / 6) * 100}%"></span></span>
            <span>${count}개</span>
        `;
        rangeStats.appendChild(item);
    });
}

function createBall(number) {
    const numberElement = document.createElement('span');
    numberElement.className = `number ${getBallClass(number)}`;
    numberElement.textContent = number;
    return numberElement;
}

function getBallClass(number) {
    if (number <= 10) return 'ball-yellow';
    if (number <= 20) return 'ball-blue';
    if (number <= 30) return 'ball-red';
    if (number <= 40) return 'ball-gray';
    return 'ball-green';
}

function loadHistory() {
    try {
        const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY));
        return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
    } catch {
        return [];
    }
}

function formatTime(date) {
    return new Intl.DateTimeFormat('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}

function formatShortTime(value) {
    return new Intl.DateTimeFormat('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function setTheme(theme) {
    const isDark = theme === 'dark';

    document.body.classList.toggle('dark-mode', isDark);
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? '화이트 모드로 전환' : '다크 모드로 전환');
    themeToggleIcon.textContent = isDark ? '☀' : '☾';
    themeToggleText.textContent = isDark ? '화이트' : '다크';
    localStorage.setItem('theme', theme);
}
