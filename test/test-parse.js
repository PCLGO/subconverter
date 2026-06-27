// Test script for subtitle conversion engine
// Extract just the conversion logic from index.html and test it

// ===== UTILITY FUNCTIONS =====
function timeToMs(str) {
    str = str.trim().replace(/,/g, '.');
    const parts = str.split(':');
    if (parts.length === 2) {
        const mm = parseFloat(parts[0]);
        const ss = parseFloat(parts[1]);
        return (mm * 60 + ss) * 1000;
    }
    if (parts.length === 3) {
        const hh = parseFloat(parts[0]);
        const mm = parseFloat(parts[1]);
        const ss = parseFloat(parts[2]);
        return (hh * 3600 + mm * 60 + ss) * 1000;
    }
    return 0;
}

function msToLRCTime(ms) {
    const totalSec = Math.max(0, Math.round(ms / 10) / 100);
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const ss = String(Math.floor(totalSec % 60)).padStart(2, '0');
    const xx = String(Math.floor((totalSec % 1) * 100)).padStart(2, '0');
    return `${mm}:${ss}.${xx}`;
}

function msToStandardTime(ms, decimalSep) {
    const totalMs = Math.max(0, Math.round(ms));
    const hh = String(Math.floor(totalMs / 3600000)).padStart(2, '0');
    const mm = String(Math.floor((totalMs % 3600000) / 60000)).padStart(2, '0');
    const ss = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, '0');
    const mmm = String(totalMs % 1000).padStart(3, '0');
    return `${hh}:${mm}:${ss}${decimalSep}${mmm}`;
}

function msToASSTime(ms) {
    const totalMs = Math.max(0, Math.round(ms));
    const h  = String(Math.floor(totalMs / 3600000));
    const mm = String(Math.floor((totalMs % 3600000) / 60000)).padStart(2, '0');
    const ss = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, '0');
    const cc = String(Math.floor((totalMs % 1000) / 10)).padStart(2, '0');
    return `${h}:${mm}:${ss}.${cc}`;
}

function msToSBVTime(ms) {
    const totalMs = Math.max(0, Math.round(ms));
    const h  = String(Math.floor(totalMs / 3600000));
    const mm = String(Math.floor((totalMs % 3600000) / 60000)).padStart(2, '0');
    const ss = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, '0');
    const mmm = String(totalMs % 1000).padStart(3, '0');
    return `${h}:${mm}:${ss}.${mmm}`;
}

function stripHTMLTags(text) {
    return text.replace(/<[^>]*>/g, '').trim();
}

function stripASSTags(text) {
    return text
        .replace(/\{[^}]*\}/g, '')
        .replace(/\\N/gi, '\n')
        .replace(/\\n/gi, '\n')
        .replace(/\\h/gi, ' ')
        .replace(/\\(?!\n)/g, '')
        .trim();
}

// ===== PARSERS =====

function parseVTT(content) {
    const lines = content.split(/\r?\n/);
    const cues = [];
    let i = 0;
    while (i < lines.length) {
        let t = lines[i].trim();
        i++;
        if (t === '' || t === 'WEBVTT' || t.startsWith('WEBVTT')) continue;
        if (t.startsWith('NOTE') || t.startsWith('STYLE') || t.startsWith('REGION')) {
            while (i < lines.length && lines[i].trim() !== '') i++;
            continue;
        }
        if (/-->/.test(t)) { i--; break; }
        if (!/-->/.test(t)) continue;
        break;
    }
    while (i < lines.length) {
        let t = lines[i].trim();
        i++;
        if (t === '') continue;
        if (!/-->/.test(t)) {
            if (i < lines.length) t = lines[i].trim();
            i++;
        }
        if (!/-->/.test(t)) continue;
        const parts = t.split('-->');
        const start = timeToMs(parts[0].trim());
        const end = timeToMs(parts[1].trim());
        const textLines = [];
        while (i < lines.length) {
            const line = lines[i].trim();
            i++;
            if (line === '') break;
            textLines.push(stripHTMLTags(line));
        }
        const text = textLines.join(' ').replace(/\s+/g, ' ').trim();
        if (text) cues.push({ start, end, text });
    }
    return cues;
}

function parseSRT(content) {
    const lines = content.split(/\r?\n/);
    const cues = [];
    let i = 0;
    while (i < lines.length) {
        let t = lines[i].trim();
        i++;
        if (t === '' || /^\d+$/.test(t)) continue;
        if (!/-->/.test(t)) continue;
        const parts = t.split('-->');
        const start = timeToMs(parts[0].trim());
        const end = timeToMs(parts[1].trim());
        const textLines = [];
        while (i < lines.length) {
            const line = lines[i].trim();
            i++;
            if (line === '') break;
            textLines.push(stripHTMLTags(line));
        }
        const text = textLines.join(' ').replace(/\s+/g, ' ').trim();
        if (text) cues.push({ start, end, text });
    }
    return cues;
}

function splitASSDialogue(raw, fieldCount) {
    const result = [];
    let current = '';
    let depth = 0;
    for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];
        if (ch === '{') depth++;
        if (ch === '}') depth = Math.max(0, depth - 1);
        if (ch === ',' && depth === 0) {
            result.push(current.trim());
            current = '';
            if (result.length === fieldCount - 1) {
                result.push(raw.slice(i + 1).trim());
                return result;
            }
        } else {
            current += ch;
        }
    }
    result.push(current.trim());
    return result;
}

function parseASS(content) {
    const lines = content.split(/\r?\n/);
    const cues = [];
    let inEvents = false;
    let formatLine = null;
    for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();
        if (/^\[Events\]/i.test(t)) { inEvents = true; continue; }
        if (/^\[/.test(t) && inEvents) { inEvents = false; continue; }
        if (!inEvents) continue;
        if (/^Format:/i.test(t)) {
            formatLine = t.slice(7).split(',').map(s => s.trim().toLowerCase());
            continue;
        }
        if (/^Dialogue:/i.test(t)) {
            if (!formatLine) continue;
            const raw = t.slice(9);
            const fields = splitASSDialogue(raw, formatLine.length);
            const startIdx = formatLine.indexOf('start');
            const endIdx = formatLine.indexOf('end');
            const textIdx = formatLine.indexOf('text');
            if (startIdx === -1 || endIdx === -1 || textIdx === -1) continue;
            const start = timeToMs(fields[startIdx] || '0');
            const end = timeToMs(fields[endIdx] || '0');
            const text = stripASSTags((fields[textIdx] || '').trim()).replace(/\s+/g, ' ').trim();
            if (text) cues.push({ start, end, text });
        }
    }
    return cues;
}

function parseLRC(content) {
    const lines = content.split(/\r?\n/);
    const cues = [];
    const tsRegex = /\[(\d{2}):(\d{2})[\.:](\d{2,3})\]/g;
    for (const line of lines) {
        const t = line.trim();
        if (!t) continue;
        if (/^\[(ti|ar|al|by|offset|re|length):/i.test(t)) continue;
        const matches = [...t.matchAll(tsRegex)];
        if (matches.length === 0) continue;
        let text = t;
        for (const m of matches) text = text.replace(m[0], '');
        text = text.trim();
        if (!text) continue;
        for (const m of matches) {
            const mm = parseInt(m[1], 10);
            const ss = parseInt(m[2], 10);
            const msPart = m[3].padEnd(3, '0').slice(0, 3);
            const start = (mm * 60 + ss) * 1000 + parseInt(msPart, 10);
            const end = start + 5000;
            cues.push({ start, end, text });
        }
    }
    cues.sort((a, b) => a.start - b.start);
    for (let i = 0; i < cues.length - 1; i++) {
        if (cues[i].end === cues[i].start + 5000 || cues[i].end <= cues[i].start) {
            cues[i].end = Math.min(cues[i].end, cues[i + 1].start);
        }
    }
    return cues;
}

function parseSBV(content) {
    const lines = content.split(/\r?\n/);
    const cues = [];
    let i = 0;
    while (i < lines.length) {
        const t = lines[i].trim();
        i++;
        if (t === '') continue;
        let startStr, endStr;
        if (/-->/.test(t)) {
            const parts = t.split('-->');
            startStr = parts[0].trim();
            endStr = parts[1].trim();
        } else {
            const commaIdx = t.indexOf(',');
            if (commaIdx === -1) continue;
            startStr = t.slice(0, commaIdx).trim();
            endStr = t.slice(commaIdx + 1).trim();
        }
        const start = timeToMs(startStr);
        const end = timeToMs(endStr);
        const textLines = [];
        while (i < lines.length) {
            const line = lines[i].trim();
            i++;
            if (line === '') break;
            textLines.push(stripHTMLTags(line));
        }
        const text = textLines.join(' ').replace(/\s+/g, ' ').trim();
        if (text) cues.push({ start, end, text });
    }
    return cues;
}

// ===== GENERATORS =====

function generateLRC(cues) {
    return cues.map(c => `[${msToLRCTime(c.start)}]${c.text}`).join('\n') + '\n';
}

function generateSRT(cues) {
    return cues.map((c, i) => {
        const start = msToStandardTime(c.start, ',');
        const end = msToStandardTime(c.end, ',');
        return `${i + 1}\n${start} --> ${end}\n${c.text}\n`;
    }).join('\n');
}

function generateVTT(cues) {
    return 'WEBVTT\n\n' + cues.map(c => {
        const start = msToStandardTime(c.start, '.');
        const end = msToStandardTime(c.end, '.');
        return `${start} --> ${end}\n${c.text}`;
    }).join('\n\n') + '\n';
}

function generateASS(cues) {
    const header = `[Script Info]
Title: Converted from subtitle
ScriptType: v4.00+
Collisions: Normal
PlayResX: 384
PlayResY: 288
Timer: 100.0000

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,1,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
    return header + cues.map(c => {
        const start = msToASSTime(c.start);
        const end = msToASSTime(c.end);
        return `Dialogue: 0,${start},${end},Default,,0,0,0,,${c.text.replace(/\n/g, '\\N')}`;
    }).join('\n') + '\n';
}

function generateSSA(cues) {
    const header = `[Script Info]
Title: Converted from subtitle
ScriptType: v4.00
Collisions: Normal
PlayResX: 384
PlayResY: 288
Timer: 100.0000

[V4 Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, TertiaryColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, AlphaLevel, Encoding
Style: Default,Arial,20,65535,65535,65535,-2147483640,-1,0,1,2,2,2,10,10,10,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
    return header + cues.map(c => {
        const start = msToASSTime(c.start);
        const end = msToASSTime(c.end);
        return `Dialogue: 0,${start},${end},Default,,0,0,0,,${c.text.replace(/\n/g, '\\N')}`;
    }).join('\n') + '\n';
}

function generateSBV(cues) {
    return cues.map(c => {
        const start = msToSBVTime(c.start);
        const end = msToSBVTime(c.end);
        return `${start},${end}\n${c.text}`;
    }).join('\n\n') + '\n';
}

// ===== TEST =====

const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'test');
const files = fs.readdirSync(testDir).filter(f => f !== '.gitkeep');
const results = [];

for (const file of files) {
    const content = fs.readFileSync(path.join(testDir, file), 'utf-8');
    const ext = path.extname(file).slice(1);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 ${file}`);
    console.log(`${'='.repeat(60)}`);

    // Detect parser
    let parser;
    switch (ext) {
        case 'vtt': parser = parseVTT; break;
        case 'srt': parser = parseSRT; break;
        case 'ass': case 'ssa': parser = parseASS; break;
        case 'lrc': parser = parseLRC; break;
        case 'sbv': parser = parseSBV; break;
        default: console.log(`  ❌ Unknown format: ${ext}`); continue;
    }

    // Parse
    let cues;
    try {
        cues = parser(content);
        console.log(`  ✅ Parsed ${cues.length} cues`);
    } catch (e) {
        console.log(`  ❌ Parse error: ${e.message}`);
        continue;
    }

    // Show parsed cues
    cues.forEach((c, i) => {
        console.log(`    ${i+1}. [${c.start}ms - ${c.end}ms] "${c.text.slice(0, 40)}${c.text.length > 40 ? '...' : ''}"`);
    });

    // Test each generator
    const generators = {
        lrc: generateLRC,
        srt: generateSRT,
        vtt: generateVTT,
        ass: generateASS,
        ssa: generateSSA,
        sbv: generateSBV,
    };

    for (const [fmt, gen] of Object.entries(generators)) {
        try {
            const output = gen(cues);
            const lines = output.trim().split('\n').length;
            console.log(`  ✅ → .${fmt} (${lines} lines)`);

            // Verify parse round-trip for LRC/SRT/VTT/SBV (not ASS due to formatting loss)
            if (['lrc', 'srt', 'vtt', 'sbv'].includes(fmt)) {
                const reparseMap = { lrc: parseLRC, srt: parseSRT, vtt: parseVTT, sbv: parseSBV };
                const reCues = reparseMap[fmt](output);
                const match = reCues.length === cues.length &&
                    reCues.every((c, i) => Math.abs(c.start - cues[i].start) <= 2 && c.text === cues[i].text);
                if (match) {
                    console.log(`    ↻ Round-trip OK (${reCues.length} cues)`);
                } else {
                    console.log(`    ⚠ Round-trip: expected ${cues.length} cues, got ${reCues.length}`);
                    reCues.forEach((c, i) => {
                        if (i < cues.length) {
                            const startDiff = Math.abs(c.start - cues[i].start);
                            const textMatch = c.text === cues[i].text;
                            if (startDiff > 2 || !textMatch) {
                                console.log(`      Mismatch #${i+1}: startDiff=${startDiff}ms, textMatch=${textMatch}`);
                                console.log(`        Expected: "${cues[i].text}"`);
                                console.log(`        Got:      "${c.text}"`);
                            }
                        }
                    });
                }
            }
        } catch (e) {
            console.log(`  ❌ → .${fmt}: ${e.message}`);
        }
    }
}

console.log('\n' + '='.repeat(60));
console.log('✅ All tests completed');
