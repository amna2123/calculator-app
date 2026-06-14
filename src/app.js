let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;
let expressionText = '';

const resultDisplay = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');

function updateDisplay() {
    resultDisplay.value = currentInput;
    expressionDisplay.textContent = expressionText;
}

function appendNumber(num) {
    if (shouldResetScreen) {
        currentInput = '';
        shouldResetScreen = false;
    }
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else {
        if (currentInput.length >= 15) return;
        currentInput += num;
    }
    updateDisplay();
}

function appendDot() {
    if (shouldResetScreen) {
        currentInput = '0';
        shouldResetScreen = false;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operator !== null && !shouldResetScreen) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetScreen = true;
    expressionText = `${previousInput} ${getSymbol(op)}`;
    updateDisplay();
}

function getSymbol(op) {
    switch (op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        default: return op;
    }
}

function calculate() {
    if (operator === null || shouldResetScreen) return;

    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(curr)) return;

    let result;
    switch (operator) {
        case '+': result = prev + curr; break;
        case '-': result = prev - curr; break;
        case '*': result = prev * curr; break;
        case '/':
            if (curr === 0) {
                resultDisplay.value = 'Error';
                expressionText = '';
                currentInput = '0';
                operator = null;
                previousInput = '';
                shouldResetScreen = true;
                updateDisplay();
                return;
            }
            result = prev / curr;
            break;
        default: return;
    }

    expressionText = `${previousInput} ${getSymbol(operator)} ${currentInput} =`;
    currentInput = parseFloat(result.toFixed(10)).toString();
    operator = null;
    shouldResetScreen = true;
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetScreen = false;
    expressionText = '';
    updateDisplay();
}

function toggleSign() {
    if (currentInput !== '0') {
        currentInput = (parseFloat(currentInput) * -1).toString();
        updateDisplay();
    }
}

function appendPercent() {
    currentInput = (parseFloat(currentInput) / 100).toString();
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '.') {
        appendDot();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        if (!shouldResetScreen && currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    } else if (e.key === 'Escape') {
        clearAll();
    } else if (e.key === '%') {
        appendPercent();
    }
});