// ===== ELEMENTS =====
const mainDisplay = document.getElementById("mainDisplay");
const hexDisplay  = document.getElementById("hex");
const decDisplay  = document.getElementById("dec");
const binDisplay  = document.getElementById("bin");
const buttons = document.querySelectorAll(".keypad button");

// ===== STATE =====
let currentValue = "";
let previousValue = "";
let operator = "";

// ===== HELPERS =====
function isHexChar(char) {
    return /^[0-9A-F]$/.test(char);
}

function hexToDec(hex) {
    return parseInt(hex, 16);
}

function decToHex(dec) {
    return dec.toString(16).toUpperCase();
}

function decToBin(dec) {
    return dec.toString(2);
}

function updateDisplays(hexValue) {
    if (!hexValue) {
        hexDisplay.value = "";
        decDisplay.value = "";
        binDisplay.value = "";
        return;
    }

    const dec = hexToDec(hexValue);
    hexDisplay.value = hexValue;
    decDisplay.value = dec;
    binDisplay.value = decToBin(dec);
}

// ===== COMPUTE =====
function compute() {
    if (!previousValue || !currentValue || !operator) return;

    const a = hexToDec(previousValue);
    const b = hexToDec(currentValue);
    let result;

    switch (operator) {
        case "+": result = a + b; break;
        case "-": result = a - b; break;
        case "X": result = a * b; break;
        case "/":
            if (b === 0) {
                alert("Cannot divide by zero");
                return;
            }
            result = Math.floor(a / b);
            break;
        default:
            return;
    }

    currentValue = decToHex(result);
    previousValue = "";
    operator = "";

    mainDisplay.value = currentValue;
    updateDisplays(currentValue);
}

// ===== BUTTON HANDLING =====
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent.trim();

        // CLEAR
        if (value === "C") {
            currentValue = "";
            previousValue = "";
            operator = "";
            mainDisplay.value = "";
            updateDisplays("");
            return;
        }

        // BACKSPACE
        if (value === "←") {
            currentValue = currentValue.slice(0, -1);
            mainDisplay.value = currentValue;
            updateDisplays(currentValue);
            return;
        }

        // OPERATOR
        if (["+", "-", "X", "/"].includes(value)) {
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
            mainDisplay.value = currentValue;
            updateDisplays(currentValue);
        }
    });
});