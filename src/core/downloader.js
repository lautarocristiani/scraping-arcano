const fs = require('fs');
const path = require('path');
const { log } = require('../utils/logger');

async function downloadPDF(page, siglo, options = { overwrite: true }) {
  try {
    log.ritual(`🧲 Invocando la descarga del manuscrito del Siglo ${siglo}...`);

    const section = page.locator(`text="Siglo ${siglo}"`).first();
    const button = section.locator('xpath=ancestor::div[contains(@class, "flex")]//button[contains(., "Descargar PDF")]');

    const downloadPromise = page.waitForEvent('download');
    await button.click();
    const download = await downloadPromise;

    const fileName = download.suggestedFilename();
    const downloadPath = path.resolve('pdfs', fileName);
    await fs.promises.mkdir('pdfs', { recursive: true });

    if (options.overwrite || !fs.existsSync(downloadPath)) {
      await download.saveAs(downloadPath);
      log.success(`📥 PDF del Siglo ${siglo} guardado como: ${fileName}`);
    } else {
      log.warn(`⚠️ El PDF del Siglo ${siglo} ya existe, no se sobrescribió.`);
    }

    return downloadPath;
  } catch (error) {
    log.error(`❌ Error al descargar PDF del Siglo ${siglo}: ${error.message}`);
    return null;
  }
}

module.exports = { downloadPDF };