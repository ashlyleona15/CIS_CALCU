// ── Expression helpers ─────────────────────────────────
function normalizeExpression(exp) {
    return exp
        .replace(/\bXOR\b/gi, "^")
        .replace(/\bAND\b/gi, "&&")
        .replace(/\bOR\b/gi, "||")
        .replace(/\bNOT\b/gi, "!")
        .replace(/\bTRUE\b/gi, "true")
        .replace(/\bFALSE\b/gi, "false");
}

function extractVariables(exp) {
    // Matches capital letters P, Q, R, S, T
    const matches = exp.match(/\b[PQRST]\b/g);
    if (!matches) return [];
    return [...new Set(matches)].sort();
}

// ── Operator / variable insert ─────────────────────────
function insertOp(op) {
    const inp = document.getElementById("expression");
    inp.focus();
    const s = inp.selectionStart, e = inp.selectionEnd;
    const v = inp.value;
    inp.value = v.slice(0, s) + op + v.slice(e);
    const pos = s + op.length;
    inp.setSelectionRange(pos, pos);
    updateLivePreview();
}

function backspaceOp() {
    const inp = document.getElementById("expression");
    inp.focus();
    const s = inp.selectionStart, e = inp.selectionEnd;
    if (s === e && s > 0) {
        inp.value = inp.value.slice(0, s - 1) + inp.value.slice(s);
        inp.setSelectionRange(s - 1, s - 1);
    } else if (s !== e) {
        inp.value = inp.value.slice(0, s) + inp.value.slice(e);
        inp.setSelectionRange(s, s);
    }
    updateLivePreview();
}

function clearInput() {
    const inp = document.getElementById("expression");
    inp.value = "";
    inp.focus();
    updateLivePreview();
    document.getElementById("table").innerHTML = "";
    document.getElementById("error-msg").textContent = "";
    document.getElementById("copy-btn").style.display = "none";
    document.getElementById("clear-btn").style.display = "none";
    document.getElementById("classification").style.display = "none";
    document.getElementById("classification").innerHTML = "";
}

// ── Live preview ───────────────────────────────────────
function updateLivePreview() {
    const raw = document.getElementById("expression").value.trim();
    const preview = document.getElementById("live-preview");
    const varBtns = document.querySelectorAll(".var-btn");

    if (!raw) {
        preview.innerHTML = "";
        varBtns.forEach(b => b.classList.remove("used"));
        return;
    }

    const exp = normalizeExpression(raw);
    const vars = extractVariables(exp);

    varBtns.forEach(b => {
        b.classList.toggle("used", vars.includes(b.textContent.trim()));
    });

    if (vars.length === 0) {
        preview.innerHTML = `<span class="preview-error" style="color:#ff4d4d; font-size:0.8rem;">No variables (P-T) found</span>`;
        return;
    }

    if (vars.length > 6) {
        preview.innerHTML = `<span class="preview-error" style="color:#ff4d4d; font-size:0.8rem;">Too many variables (max 6)</span>`;
        return;
    }

    const rows = 1 << vars.length;
    const varBadges = vars.map(v => `<span class="var-badge" style="background:rgba(59,130,246,0.3); border:1px solid #3b82f6; padding:2px 8px; border-radius:4px; margin:0 4px;">${v}</span>`).join("");
    preview.innerHTML = `<div class="preview-vars" style="font-size:0.8rem;">Variables: ${varBadges} <span>(${rows} rows)</span></div>`;
}

// ── Main generator ─────────────────────────────────────
function generateTable() {
    const rawExp = document.getElementById("expression").value.trim();
    const errorEl = document.getElementById("error-msg");
    const table = document.getElementById("table");
    const copyBtn = document.getElementById("copy-btn");
    const clearBtn = document.getElementById("clear-btn");
    const classEl = document.getElementById("classification");

    table.innerHTML = "";
    errorEl.textContent = "";
    classEl.style.display = "none";

    if (!rawExp) { 
        errorEl.textContent = "Please enter a logical expression."; 
        return; 
    }

    const exp = normalizeExpression(rawExp);
    const vars = extractVariables(exp);

    if (vars.length === 0) { errorEl.textContent = "No variables (P–T) found."; return; }
    if (vars.length > 6) { errorEl.textContent = "Max 6 variables allowed."; return; }

    const rowCount = 1 << vars.length;
    const results = [];
    let hasError = false;

    // Build Header
    let headerHtml = "<tr>";
    vars.forEach(v => headerHtml += `<th>${v}</th>`);
    headerHtml += `<th>Result</th></tr>`;
    table.innerHTML = headerHtml;

    // Generate Rows and collect results
    for (let i = 0; i < rowCount; i++) {
        const assignments = {};
        vars.forEach((v, idx) => { 
            assignments[v] = Boolean(i & (1 << (vars.length - 1 - idx))); 
        });

        const scopeVars = vars.map(v => `var ${v} = ${assignments[v]};`).join(" ");
        const safeEvalExp = exp.replace(/\^/g, "!==");

        let result;
        try { 
            result = new Function(`${scopeVars} return !!(${safeEvalExp});`)(); 
            results.push(result);
        } catch(e) { 
            result = "Error"; 
            hasError = true; 
        }

        const valueCells = vars.map(v => `<td>${assignments[v] ? "T" : "F"}</td>`).join("");
        const rowClass = result === true ? "true" : result === false ? "false" : "";
        table.innerHTML += `<tr class="${rowClass}">${valueCells}<td>${result === true ? "T" : result === false ? "F" : result}</td></tr>`;
    }

    if (hasError) {
        errorEl.textContent = "Syntax Error in expression.";
    } else {
        copyBtn.style.display = "inline-block";
        clearBtn.style.display = "inline-block";

        // ── Classification Logic ──
        const allTrue = results.every(r => r === true);
        const allFalse = results.every(r => r === false);

        let type, label, desc, icon;
        if (allTrue) {
            type = "tautology";
            label = "Tautology";
            desc = "Always TRUE for all inputs";
            icon = "✅";
        } else if (allFalse) {
            type = "contradiction";
            label = "Contradiction";
            desc = "Always FALSE for all inputs";
            icon = "❌";
        } else {
            type = "contingency";
            label = "Contingency";
            desc = "Mix of TRUE and FALSE results";
            icon = "🔀";
        }

        classEl.style.display = "block";
        classEl.innerHTML = `
            <div class="class-badge ${type}" style="padding:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.05); display:flex; align-items:center; gap:15px; justify-content:center;">
                <span class="class-icon" style="font-size:1.5rem;">${icon}</span>
                <div style="text-align:left;">
                    <div style="font-weight:bold; text-transform:uppercase; letter-spacing:1px;">${label}</div>
                    <div class="class-desc" style="font-size:0.7rem; opacity:0.8;">${desc}</div>
                </div>
            </div>`;
    }
}
