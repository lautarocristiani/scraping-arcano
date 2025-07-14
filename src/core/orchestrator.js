const fs = require('fs');
const { loginAndGetPage } = require('./browser');
const { downloadPDF } = require('./downloader');
const { extractCode } = require('./extractor');
const { unlockManuscrito } = require('./unlocker');
const { extractApiInfo } = require('../services/api');
const { getTitle, nextPage } = require('../utils/helpers');
const { log } = require('../utils/logger');

const siglos = ['XIV', 'XV', 'XVI', 'XVII', 'XVIII'];

(async () => {
  // 🗂️ Asegurar que la carpeta 'pdfs' exista
  fs.mkdirSync('pdfs', { recursive: true });

  const { browser, page } = await loginAndGetPage();

  let code = null;

  for (const siglo of siglos) {
    let titulo;

    log.divider(`Comenzando ritual para el Siglo ${siglo}`);

    if (siglo === 'XVII' || siglo === 'XVIII') {
      await nextPage(page);
      titulo = await getTitle(page, siglo);
      code = await extractApiInfo(page, siglo, code, titulo);
    }

    await unlockManuscrito(page, code, siglo);

    const pdfPath = await downloadPDF(page, siglo, { overwrite: true });
    code = await extractCode(pdfPath);
  }

  log.success("🔚 Ritual completo. Todos los manuscritos han sido transcritos.");
  await browser.close();
})();
