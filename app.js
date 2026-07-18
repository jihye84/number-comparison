// State variables
let state = {
    leftNumber: 0,
    rightNumber: 0,
    mode: 'match', // 'match' or 'diff'
    showNumber: 'off',
    leftType: 'stones',
    rightType: 'stones'
};

const visualTypes = ['stones', 'blocks', 'baseTen'];

// DOM Elements
const btnMode = document.getElementById('btn-mode');
const btnToggleNumber = document.getElementById('btn-toggle-number');
const btnNewProblem = document.getElementById('btn-new-problem');
const leftVisual = document.getElementById('left-visual');
const rightVisual = document.getElementById('right-visual');
const leftNumberDisplay = document.getElementById('left-number-display');
const rightNumberDisplay = document.getElementById('right-number-display');
const feedbackOverlay = document.getElementById('feedback-overlay');
const feedbackMessage = document.getElementById('feedback-message');

// Initialize
function init() {
    setupEventListeners();
    generateNewProblem();
}

function setupEventListeners() {
    btnMode.addEventListener('click', () => {
        state.mode = state.mode === 'match' ? 'diff' : 'match';
        btnMode.textContent = `모드: ${state.mode === 'match' ? '일치' : '다름'}`;
        btnMode.className = `btn ${state.mode === 'match' ? 'btn-blue' : 'btn-purple'}`;
        generateNewProblem();
    });

    btnToggleNumber.addEventListener('click', () => {
        if (state.showNumber === 'off') {
            state.showNumber = 'on';
            btnToggleNumber.textContent = '숫자 보기: 켜짐';
            btnToggleNumber.className = 'btn btn-green';
        } else if (state.showNumber === 'on') {
            state.showNumber = 'only';
            btnToggleNumber.textContent = '숫자만 보기';
            btnToggleNumber.className = 'btn btn-blue';
        } else {
            state.showNumber = 'off';
            btnToggleNumber.textContent = '숫자 보기: 끄기';
            btnToggleNumber.className = 'btn btn-purple';
        }
        updateNumberDisplay();
    });

    btnNewProblem.addEventListener('click', generateNewProblem);

    // 모형(교구)을 클릭했을 때 숫자 표시 (빈 공간 클릭 시엔 정답 선택으로 넘기기 위해 이벤트 버블링 유지)
    leftVisual.addEventListener('click', (e) => {
        if (e.target.closest('.manipulatives-wrapper')) {
            e.stopPropagation();
            if (state.showNumber === 'off') {
                leftNumberDisplay.classList.add('show');
            }
        }
    });

    rightVisual.addEventListener('click', (e) => {
        if (e.target.closest('.manipulatives-wrapper')) {
            e.stopPropagation();
            if (state.showNumber === 'off') {
                rightNumberDisplay.classList.add('show');
            }
        }
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNewProblem() {
    // Generate numbers 11 ~ 50
    state.leftNumber = getRandomInt(11, 50);
    state.rightNumber = getRandomInt(11, 50);

    // 더 큰 쪽을 클릭해야 하므로 두 수가 같지 않도록 보장
    while (state.leftNumber === state.rightNumber) {
        state.rightNumber = getRandomInt(11, 50);
    }

    // Assign visual types based on mode
    if (state.mode === 'match') {
        const type = visualTypes[getRandomInt(0, visualTypes.length - 1)];
        state.leftType = type;
        state.rightType = type;
    } else {
        const type1 = visualTypes[getRandomInt(0, visualTypes.length - 1)];
        let type2 = type1;
        while (type2 === type1) {
            type2 = visualTypes[getRandomInt(0, visualTypes.length - 1)];
        }
        state.leftType = type1;
        state.rightType = type2;
    }

    renderUI();
}

function renderUI() {
    renderVisual(leftVisual, state.leftNumber, state.leftType);
    renderVisual(rightVisual, state.rightNumber, state.rightType);
    updateNumberDisplay();
}

function updateNumberDisplay() {
    leftNumberDisplay.textContent = state.leftNumber;
    rightNumberDisplay.textContent = state.rightNumber;
    
    if (state.showNumber === 'on') {
        leftNumberDisplay.classList.add('show');
        rightNumberDisplay.classList.add('show');
        leftVisual.style.display = '';
        rightVisual.style.display = '';
    } else if (state.showNumber === 'only') {
        leftNumberDisplay.classList.add('show');
        rightNumberDisplay.classList.add('show');
        leftVisual.style.display = 'none';
        rightVisual.style.display = 'none';
    } else {
        leftNumberDisplay.classList.remove('show');
        rightNumberDisplay.classList.remove('show');
        leftVisual.style.display = '';
        rightVisual.style.display = '';
    }
}

function renderVisual(container, number, type) {
    container.innerHTML = ''; // Clear previous
    
    const wrapper = document.createElement('div');
    wrapper.className = 'manipulatives-wrapper';
    wrapper.title = "눌러서 숫자 확인하기!";

    const tens = Math.floor(number / 10);
    const ones = number % 10;

    if (type === 'stones') {
        // Go Stones (바둑돌)
        for (let i = 0; i < tens; i++) {
            const group = document.createElement('div');
            group.className = 'stone-group';
            for (let j = 0; j < 10; j++) {
                const stone = document.createElement('div');
                stone.className = 'stone';
                group.appendChild(stone);
            }
            wrapper.appendChild(group);
        }
        
        const looseContainer = document.createElement('div');
        looseContainer.className = 'stone-loose-container';
        for (let i = 0; i < ones; i++) {
            const stone = document.createElement('div');
            stone.className = 'stone';
            looseContainer.appendChild(stone);
        }
        wrapper.appendChild(looseContainer);

    } else if (type === 'blocks') {
        // Connecting Blocks (연결블럭)
        for (let i = 0; i < tens; i++) {
            const group = document.createElement('div');
            group.className = 'block-group';
            for (let j = 0; j < 10; j++) {
                const block = document.createElement('div');
                block.className = 'block';
                group.appendChild(block);
            }
            wrapper.appendChild(group);
        }
        
        if (ones > 0) {
            const group = document.createElement('div');
            group.className = 'block-group';
            group.style.justifyContent = 'flex-end'; // Align bottom
            for (let i = 0; i < ones; i++) {
                const block = document.createElement('div');
                block.className = 'block';
                group.appendChild(block);
            }
            wrapper.appendChild(group);
        }

    } else if (type === 'baseTen') {
        // Base Ten Blocks (수모형)
        for (let i = 0; i < tens; i++) {
            const group = document.createElement('div');
            group.className = 'base-ten-group';
            wrapper.appendChild(group);
        }
        
        const looseContainer = document.createElement('div');
        looseContainer.className = 'stone-loose-container'; // Reuse loose container style for layout
        looseContainer.style.alignContent = 'flex-end';
        for (let i = 0; i < ones; i++) {
            const one = document.createElement('div');
            one.className = 'base-one';
            looseContainer.appendChild(one);
        }
        wrapper.appendChild(looseContainer);
    }
    
    container.appendChild(wrapper);
}

function checkAnswer(side) {
    const left = state.leftNumber;
    const right = state.rightNumber;
    let isCorrect = false;

    if (side === 'left' && left > right) isCorrect = true;
    if (side === 'right' && right > left) isCorrect = true;

    const targetPanel = side === 'left' ? document.getElementById('left-panel') : document.getElementById('right-panel');

    if (isCorrect) {
        showFeedback(true);
        triggerConfetti();
        setTimeout(generateNewProblem, 2000);
    } else {
        showFeedback(false);
        targetPanel.classList.add('shake');
        setTimeout(() => targetPanel.classList.remove('shake'), 500);
    }
}

function showFeedback(isCorrect) {
    feedbackMessage.textContent = isCorrect ? '🎉 정답입니다! 🎉' : '다시 생각해 볼까요?';
    feedbackMessage.style.color = isCorrect ? '#4ECDC4' : '#FF6B6B';
    
    feedbackOverlay.classList.add('show');
    
    setTimeout(() => {
        feedbackOverlay.classList.remove('show');
    }, 1500);
}

function triggerConfetti() {
    var myCanvas = document.getElementById('confetti-canvas');
    var myConfetti = confetti.create(myCanvas, {
        resize: true,
        useWorker: true
    });
    myConfetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
    });
}

// Run app
init();
