const fs = require('fs');
const pdfParse = require('pdf-parse');
const { log } = require('../utils/logger');

async function extractCode(pdfPath) {
  log.step(`📖 Leyendo el manuscrito: ${pdfPath}`);

  if (!fs.existsSync(pdfPath)) {
    log.error(`❌ El archivo no existe: ${pdfPath}`);
    return null;
  }

  const dataBuffer = fs.readFileSync(pdfPath);
  log.step(`📦 PDF buffer cargado (${dataBuffer.length} bytes)`);

  try {
    const pdfData = await pdfParse(dataBuffer);
    const cleanedText = cleanText(pdfData.text);
    log.spell("🧾 Texto extraído con pdf-parse:");
    console.log(cleanedText);

    const code = extractCodeFromText(cleanedText);
    if (code) {
      log.success(`🔑 Código encontrado con pdf-parse: ${code}`);
      return code;
    } else {
      log.warn("⚠️ No se encontró código con pdf-parse. Intentando fallback...");
    }
  } catch (err) {
    log.error(`❌ Error con pdf-parse: ${err.message}`);
    if (!err.message.includes("bad XRef entry")) return null;
    log.warn("⚠️ Problema con XRef. Aplicando método alternativo...");
  }

  try {
    const rawText = dataBuffer.toString('latin1');
    const streamMatch = rawText.match(/stream\s+([\s\S]*?)endstream/);
    if (!streamMatch) {
      log.error("❌ No se encontró el bloque 'stream' en el PDF.");
      return null;
    }

    const streamText = streamMatch[1];
    const lines = [...streamText.matchAll(/\((.*?)\)\s*Tj/g)];
    const joinedText = lines.map(m => m[1]).join(' ');
    const cleanedStreamText = cleanText(joinedText);

    log.spell("📜 Texto extraído manualmente:");
    console.log(cleanedStreamText);

    const code = extractCodeFromText(cleanedStreamText);
    if (code) {
      log.success(`🔑 Código encontrado con fallback: ${code}`);
      return code;
    } else {
      log.error("❌ No se encontró código en el texto del stream.");
      return null;
    }
  } catch (fallbackErr) {
    log.error(`❌ Fallback también falló: ${fallbackErr.message}`);
    return null;
  }
}

function cleanText(text) {
  return text
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCodeFromText(text) {
  const regexes = [
    /c[oó]digo\s+de\s+acceso\s*:\s*([A-Z0-9]+)/i,
    /acceso\s*:\s*([A-Z0-9]+)/i,
    /codigo\s*:\s*([A-Z0-9]+)/i
  ];
  for (const rx of regexes) {
    const match = text.match(rx);
    if (match) return match[1];
  }
  return null;
}

module.exports = { extractCode };