// ── Normalize (symbols → JS) ───────────────────────────
function normalizeExpression(exp) {
    return exp
        .replace(/¬/g, "!")
        .replace(/∧/g, "&&")
        .replace(/∨/g, "||")
        .replace(/⊕/g, "^");
}

// ── Fix XOR (JS issue) ─────────────────────────────────
function fixXOR(exp) {
    return exp.replace(/\^/g, "!==");
}

// ── Fix implication recursively ────────────────────────
function fixImplication(exp) {
    while (exp.includes("→")) {
        exp = exp.replace(/(\([^()]+\)|[A-Z!]+)\s*→\s*(\([^()]+\)|[A-Z!]+)/g,
            "(!$1 || $2)");
    }
    return exp;
}

// ── Fix biconditional recursively ──────────────────────
function fixBiconditional(exp) {
    while (exp.includes("↔")) {
        exp = exp.replace(/(\([^()]+\)|[A-Z!]+)\s*↔\s*(\([^()]+\)|[A-Z!]+)/g,
            "($1 === $2)");
    }
    return exp;
}

// ── Extract variables ──────────────────────────────────
function extractVariables(exp) {
    const matches = exp.match(/\b[PQRST]\b/g);
    return matches ? [...new Set(matches)].sort() : [];
}

// ── Insert operator ────────────────────────────────────
function insertOp(op) {
    const inp = document.getElementById("expression");
    const s = inp.selectionStart;
    const e = inp.selectionEnd;
    inp.value = inp.value.slice(0, s) + op + inp.value.slice(e);
    inp.focus();
    inp.setSelectionRange(s + op.length, s + op.length);
    updateLivePreview();
}

// ── Backspace ──────────────────────────────────────────
function backspaceOp() {
    const inp = document.getElementById("expression");
    const s = inp.selectionStart;

    if (s > 0) {
        inp.value = inp.value.slice(0, s - 1) + inp.value.slice(s);
        inp.setSelectionRange(s - 1, s - 1);
    }

    inp.focus();
    updateLivePreview();
}

// ── Clear ──────────────────────────────────────────────
function clearInput() {
    document.getElementById("expression").value = "";
    document.getElementById("table").innerHTML = "";
    document.getElementById("error-msg").textContent = "";
    document.getElementById("classification").innerHTML = "";
}

// ── Preview ────────────────────────────────────────────
function updateLivePreview() {
    const raw = document.getElementById("expression").value.trim();
    const preview = document.getElementById("live-preview");

    if (!raw) {
        preview.innerHTML = "";
        return;
    }

    const vars = extractVariables(raw);
    const rows = 1 << vars.length;

    preview.innerHTML = `Variables: ${vars.join(", ")} (${rows} rows)`;
}

// ── MAIN ───────────────────────────────────────────────
function generateTable() {
    const raw = document.getElementById("expression").value.trim();
    const table = document.getElementById("table");
    const error = document.getElementById("error-msg");
    const classEl = document.getElementById("classification");

    table.innerHTML = "";
    error.textContent = "";
    classEl.innerHTML = "";

    if (!raw) {
        error.textContent = "Enter expression";
        return;
    }

    let exp = normalizeExpression(raw);
    exp = fixImplication(exp);
    exp = fixBiconditional(exp);
    exp = fixXOR(exp);

    const vars = extractVariables(raw);

    if (vars.length === 0) {
        error.textContent = "No variables found";
        return;
    }

    const rows = 1 << vars.length;
    let results = [];

    // Header
    let header = "<tr>";
    vars.forEach(v => header += `<th>${v}</th>`);
    header += "<th>Result</th></tr>";
    table.innerHTML = header;

    // Rows
    for (let i = 0; i < rows; i++) {
        let scope = {};
        vars.forEach((v, j) => {
            scope[v] = Boolean(i & (1 << (vars.length - j - 1)));
        });

        let scopeStr = vars.map(v => `var ${v}=${scope[v]};`).join("");

        let result;
        try {
            result = new Function(scopeStr + `return ${exp}`)();
            results.push(result);
        } catch {
            error.textContent = "Syntax Error";
            return;
        }

        let row = "<tr>";
        vars.forEach(v => row += `<td>${scope[v] ? "T" : "F"}</td>`);
        row += `<td>${result ? "T" : "F"}</td></tr>`;
        table.innerHTML += row;
    }

    // Classification
    const allTrue = results.every(r => r);
    const allFalse = results.every(r => !r);

    if (allTrue) {
        classEl.innerHTML = "✅ Tautology";
    } else if (allFalse) {
        classEl.innerHTML = "❌ Contradiction";
    } else {
        classEl.innerHTML = "🔀 Contingency";
    }
}
