// ── Insert text into input ──
function insert(val){
    const input = document.getElementById("expression");
    input.value += val;
    input.focus();
}

// ── Clear everything ──
function clearAll(){
    document.getElementById("expression").value = "";
    document.getElementById("table").innerHTML = "";
}

// ── Extract variables (lowercase support) ──
function getVars(exp){
    const matches = exp.match(/[a-z]/g); // FIX: lowercase variables
    if(!matches) return [];
    return [...new Set(matches)].sort();
}

// ── Generate Truth Table ──
function generate(){
    const expInput = document.getElementById("expression");
    const table = document.getElementById("table");

    let exp = expInput.value.trim();
    table.innerHTML = "";

    if(!exp){
        alert("Enter a logical expression!");
        return;
    }

    // Normalize words (optional but useful)
    exp = exp
        .replace(/\bAND\b/gi, "&&")
        .replace(/\bOR\b/gi, "||")
        .replace(/\bNOT\b/gi, "!")
        .replace(/\bXOR\b/gi, "^");

    const vars = getVars(exp);

    if(vars.length === 0){
        alert("Use variables like p, q, r");
        return;
    }

    if(vars.length > 6){
        alert("Maximum 6 variables only!");
        return;
    }

    const rows = 1 << vars.length;

    // ── Header ──
    let header = "<tr>";
    vars.forEach(v => header += `<th>${v}</th>`);
    header += `<th>${exp}</th></tr>`;
    table.innerHTML += header;

    // ── Generate rows ──
    for(let i = 0; i < rows; i++){

        let rowValues = "";
        let scope = "";

        vars.forEach((v, idx) => {
            const val = Boolean(i & (1 << (vars.length - 1 - idx)));
            rowValues += `<td>${val}</td>`;
            scope += `var ${v}=${val};`;
        });

        let result;

        try{
            // Replace XOR properly
            const safeExp = exp.replace(/\^/g, "!==");
            result = new Function(scope + "return (" + safeExp + ")")();
        }catch{
            result = "Error";
        }

        // Add row color class
        const rowClass =
            result === true ? "true" :
            result === false ? "false" : "";

        table.innerHTML += `
            <tr class="${rowClass}">
                ${rowValues}
                <td>${result}</td>
            </tr>
        `;
    }
}

// ── ENTER key support ──
document.getElementById("expression").addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        generate();
    }
});