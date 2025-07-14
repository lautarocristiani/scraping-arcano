const { chromium } = require('playwright');
const { log } = require('../utils/logger');

async function loginAndGetPage() {
  log.ritual("Invocando el ritual de entrada a la cripta ancestral...");

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://pruebatecnica-sherpa-production.up.railway.app/login');
  log.step("🌀 El portal ha sido abierto ante tus ojos...");

  await page.fill('#email', 'monje@sherpa.local');
  await page.fill('#password', 'cript@123');
  log.spell("🧙‍♂️ Palabras mágicas ingresadas en los campos del hechizo...");

  await page.click('button[type="submit"]');
  log.step("✨ El conjuro fue lanzado. Esperando respuesta del guardián...");

  await page.waitForURL('**/portal', { timeout: 5000 });
  log.success("🟢 El guardián permitió tu entrada a la Cámara de Manuscritos.");

  return { browser, page };
}

module.exports = { loginAndGetPage };