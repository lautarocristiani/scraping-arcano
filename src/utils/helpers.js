const { log } = require('./logger');

async function getTitle(page, siglo) {
  const section = page.locator(`text="Siglo ${siglo}"`).first();
  const titulo = section.locator('xpath=ancestor::div[contains(@class, "flex")]//h3');
  const textoTitulo = await titulo.textContent();
  log.step(`📜 Título encontrado para el Siglo ${siglo}: ${textoTitulo}`);
  return textoTitulo;
}

async function nextPage(page) {
  const button = page.locator(`text="2"`).first();
  await button.click();
  log.spell("📖 Hoja pasada. Has avanzado en el grimorio...");
}

module.exports = { getTitle, nextPage };