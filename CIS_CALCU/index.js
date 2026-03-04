// ===== ELEMENT =====
const mainDisplay = document.getElementById("mainDisplay");
const buttons = document.querySelectorAll(".keypad button");

// ===== STATE =====
let currentValue = "";
let previousValue = "";
let operator = "";

// ===== HELPERS =====
function isHexChar(char) {
    return /^[0-9A-F]$/i.test(char);
}

function hexToDec(hex) {
    return parseInt(hex, 16);
}

function decToHex(dec) {
    return dec.toString(16).toUpperCase();
}

function clean(value) {
    if (!value) return "";
    return value.replace(/^0+(?!$)/, "");
}

// ===== UPDATE DISPLAY =====
function updateDisplay() {
    mainDisplay.value = clean(currentValue) || "0";
}

// ===== COMPUTE =====
function compute() {
    if (!previousValue || !currentValue || !operator) return;

    const a = hexToDec(previousValue);
    const b = hexToDec(currentValue);
    let result;

    switch (operator) {
        case "+":
            result = a + b;
            break;
        case "-":
            result = a - b;
            break;
        default:
            return;
    }

    currentValue = decToHex(result);
    previousValue = "";
    operator = "";
    updateDisplay();
}

// ===== BUTTON HANDLING =====
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent.trim().toUpperCase();

        // CLEAR
        if (button.classList.contains("clear")) {
            currentValue = "";
            previousValue = "";
            operator = "";
            updateDisplay();
            return;
        }

        // BACKSPACE
        if (value === "←") {
            currentValue = currentValue.slice(0, -1);
            updateDisplay();
            return;
        }

        // OPERATOR
        if (["+", "-"].includes(value)) {
            if (!currentValue) return;
            previousValue = currentValue;
            operator = value;
            currentValue = "";
            return;
        }

        // EQUALS
        if (value === "=") {
            compute();
            return;
        }

        // HEX INPUT
        if (isHexChar(value)) {
            currentValue += value;
            updateDisplay();
        }
    });
});