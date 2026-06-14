let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;
let expressionText = '';
let memory = 0;
let angleMode = 'DEG';
let isScientific = false;

const resultDisplay = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');
const memIndicator = document.getElementById('memIndicator');

function updateDisplay() {
    resultDisplay.value = currentInput;
    expressionDisplay.textContent = expressionText;
    memIndicator.style.opacity = memory !== 0 ? '1' : '0';
}

function toRad(angle) {
    return angleMode === 'DEG' ? (angle * Math.PI) / 180 : angle;
}

function fromRad(angle) {
    return angleMode === 'DEG' ? (angle * 180) / Math.PI : angle;
}

function formatResult(num) {
    if (!isFinite(num)) return 'Error';
    const rounded = parseFloat(num.toPrecision(10));
    if (Math.abs(rounded - Math.round(rounded)) < 1e-9 && Math.abs(rounded) < 1e15) {
        return Math.round(rounded).toString();
    }
    return rounded.toString();
}

function showError() {
    currentInput = 'Error';
    expressionText = '';
    operator = null;
    previousInput = '';
    shouldResetScreen = true;
    updateDisplay();
}

// --- Mode & angle toggles ---

function toggleMode() {
    isScientific = !isScientific;
    document.getElementById('sciButtons').classList.toggle('visible', isScientific);
    document.getElementById('modeBtn').textContent = isScientific ? 'Basic' : 'Scientific';
}

function toggleAngle() {
    angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
    document.getElementById('angleMode').textContent = angleMode;
}

// --- Standard input ---

function appendNumber(num) {
    if (currentInput === 'Error') currentInput = '0';
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
    if (currentInput === 'Error') currentInput = '0';
    if (shouldResetScreen) {
        currentInput = '0';
        shouldResetScreen = false;
    }
    if (!currentInput.includes('.')) currentInput += '.';
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === 'Error') return;
    if (operator !== null && !shouldResetScreen) calculate();
    previousInput = currentInput;
    operator = op;
    shouldResetScreen = true;
    expressionText = `${previousInput} ${getSymbol(op)}`;
    updateDisplay();
}

function getSymbol(op) {
    return { '+': '+', '-': '−', '*': '×', '/': '÷', '^': '^' }[op] || op;
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
            if (curr === 0) { showError(); return; }
            result = prev / curr;
            break;
        case '^': result = Math.pow(prev, curr); break;
        default: return;
    }

    expressionText = `${previousInput} ${getSymbol(operator)} ${currentInput} =`;
    currentInput = formatResult(result);
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
    if (currentInput === '0' || currentInput === 'Error') return;
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

function appendPercent() {
    if (currentInput === 'Error') return;
    const val = parseFloat(currentInput);
    if (operator && previousInput) {
        currentInput = formatResult((parseFloat(previousInput) * val) / 100);
    } else {
        currentInput = formatResult(val / 100);
    }
    updateDisplay();
}

// --- Scientific functions ---

const funcLabels = {
    sin: 'sin', cos: 'cos', tan: 'tan',
    asin: 'sin⁻¹', acos: 'cos⁻¹', atan: 'tan⁻¹',
    log: 'log', ln: 'ln', sqrt: '√', x2: 'sqr',
    '10x': '10^', ex: 'e^', fact: '', cbrt: '∛',
};

function applyFunc(fn) {
    if (currentInput === 'Error') return;
    const val = parseFloat(currentInput);
    if (isNaN(val)) return;

    let result;
    switch (fn) {
        case 'sin':  result = Math.sin(toRad(val)); break;
        case 'cos':  result = Math.cos(toRad(val)); break;
        case 'tan':
            if (angleMode === 'DEG' && Math.abs(val % 180) === 90) { showError(); return; }
            result = Math.tan(toRad(val));
            break;
        case 'asin':
            if (val < -1 || val > 1) { showError(); return; }
            result = fromRad(Math.asin(val));
            break;
        case 'acos':
            if (val < -1 || val > 1) { showError(); return; }
            result = fromRad(Math.acos(val));
            break;
        case 'atan': result = fromRad(Math.atan(val)); break;
        case 'log':
            if (val <= 0) { showError(); return; }
            result = Math.log10(val);
            break;
        case 'ln':
            if (val <= 0) { showError(); return; }
            result = Math.log(val);
            break;
        case 'sqrt':
            if (val < 0) { showError(); return; }
            result = Math.sqrt(val);
            break;
        case 'x2':  result = val * val; break;
        case '10x': result = Math.pow(10, val); break;
        case 'ex':  result = Math.exp(val); break;
        case 'fact':
            if (val < 0 || !Number.isInteger(val) || val > 170) { showError(); return; }
            result = factorial(val);
            break;
        default: return;
    }

    const label = funcLabels[fn] || fn;
    expressionText = label ? `${label}(${currentInput})` : `${currentInput}!`;
    currentInput = formatResult(result);
    shouldResetScreen = true;
    updateDisplay();
}

function factorial(n) {
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function insertConst(name) {
    const values = { π: Math.PI, e: Math.E };
    currentInput = values[name].toString();
    expressionText = name;
    shouldResetScreen = true;
    updateDisplay();
}

// --- Memory ---

function memClear()  { memory = 0; updateDisplay(); }
function memRecall() { currentInput = formatResult(memory); shouldResetScreen = true; updateDisplay(); }
function memAdd()    { memory += parseFloat(currentInput) || 0; updateDisplay(); }
function memSub()    { memory -= parseFloat(currentInput) || 0; updateDisplay(); }

// --- Keyboard ---

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') { appendNumber(e.key); return; }
    switch (e.key) {
        case '.': appendDot(); break;
        case '+': case '-': case '*': case '/': appendOperator(e.key); break;
        case '^': appendOperator('^'); break;
        case 'Enter': case '=': e.preventDefault(); calculate(); break;
        case 'Backspace':
            if (currentInput === 'Error') { currentInput = '0'; updateDisplay(); break; }
            if (!shouldResetScreen && currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
                shouldResetScreen = false;
            }
            updateDisplay();
            break;
        case 'Escape': clearAll(); break;
        case '%': appendPercent(); break;
    }
});
