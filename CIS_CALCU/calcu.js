// ===== ELEMENTS =====
const mainDisplay = document.getElementById("mainDisplay");
const hexDisplay  = document.getElementById("hex");
const decDisplay  = document.getElementById("dec");
const octDisplay  = document.getElementById("oct");
const binDisplay  = document.getElementById("bin");
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

function decToBin(dec) {
    return dec.toString(2);
}

function decToOct(dec) {
    return dec.toString(8);
}

function clean(value) {
    if (!value) return "";
    return value.replace(/^0+(?!$)/, "");
}

// ===== UPDATE DISPLAY =====
function updateDisplays(hexValue) {
    if (!hexValue) {
        hexDisplay.value = "";
        decDisplay.value = "";
        octDisplay.value = "";
        binDisplay.value = "";
        return;
    }

    const dec = hexToDec(hexValue);
    if (isNaN(dec)) return;

    hexDisplay.value = clean(hexValue.toUpperCase());
    decDisplay.value = clean(dec.toString());
    octDisplay.value = clean(decToOct(dec));
    binDisplay.value = clean(decToBin(dec));
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
        case "X":
            result = a * b;
            break;
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

    mainDisplay.value = clean(currentValue);
    updateDisplays(currentValue);
}

// ===== BUTTON HANDLING =====
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent.trim().toUpperCase();

        // ✅ CLEAR (ONLY the button with class="clear")
        if (button.classList.contains("clear")) {
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
            mainDisplay.value = clean(currentValue);
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

        // HEX INPUT (0–9, A–F INCLUDING C)
        if (isHexChar(value)) {
            currentValue += value;
            mainDisplay.value = clean(currentValue);
            updateDisplays(currentValue);
        }
    });
});