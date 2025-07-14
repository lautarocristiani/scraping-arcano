const { log } = require('../utils/logger');

async function unlockManuscrito(page, code, siglo) {
  if (!code) {
    log.step('🚪 No hay código para desbloquear el manuscrito.');
    return;
  }

  const titulo = await page.locator(`text="Siglo ${siglo}"`).first();
  const container = titulo.locator('xpath=ancestor::div[contains(@class, "flex")]');

  const input = container.locator('input[placeholder="Ingresá el código"]');
  await input.fill(code);

  const boton = container.locator('button:has-text("Desbloquear")');
  await boton.click();

  log.spell(`🔓 Manuscrito del Siglo ${siglo} intentado desbloquear.`);

  if (siglo === 'XVII' || siglo === 'XVIII') {
    const closeModalButton = page.locator('[aria-label="Cerrar modal"]');
    await closeModalButton.click();
    log.step("🧼 Cerrando el portal dimensional tras la invocación.");
  }
}

module.exports = { unlockManuscrito };