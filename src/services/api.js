const axios = require('axios');
const { log } = require('../utils/logger');

async function extractApiInfo(page, siglo, code, title) {
    const section = page.locator(`text="Siglo ${siglo}"`).first();
    const button = section.locator('xpath=ancestor::div[contains(@class, "flex")]//button[contains(., "Ver Documentación")]');
    await button.click();

    const apiBox = page.locator('text=Información de la API').locator('xpath=ancestor::div[1]');
    const metodo = await apiBox.locator('text=Método:').locator('xpath=following-sibling::span[1]').textContent();
    const endpoint = await apiBox.locator(':text("https://")').first().textContent();

    const rawParams = await apiBox.locator('li').allTextContents();
    const parametros = rawParams.map(linea => {
        const match = linea.match(/^([a-zA-Z0-9_]+)/);
        return match ? match[1] : null;
    }).filter(Boolean);

    const queryData = {};
    for (const p of parametros) {
        if (p.toLowerCase().includes('code')) {
            queryData[p] = code;
        } else if (p.toLowerCase().includes('title') || p.toLowerCase().includes('book')) {
            queryData[p] = title;
        } else {
            queryData[p] = '';
        }
    }

    const queryParams = new URLSearchParams(queryData);
    const urlCompleta = `${endpoint}?${queryParams.toString()}`;
    log.spell("📡 Invocando la API con el siguiente conjuro:");
    console.log(urlCompleta);

    const closeModalButton = page.locator('[aria-label="Cerrar modal"]');
    await closeModalButton.click();

    if (metodo.toUpperCase() === 'GET') {
        try {
            const response = await axios.get(urlCompleta);
            log.success('📬 Respuesta recibida de los oráculos:');
            console.log(response.data);

            if (response.data.success && response.data.challenge) {
                const { vault, targets } = response.data.challenge;
                const password = targets.map(i => vault[i]).join('').trim();
                log.final(`🔐 Contraseña decodificada: ${password}`);
                return password;
            } else {
                log.warn('⚠️ Desafío no válido o sin éxito.');
                return null;
            }
        } catch (err) {
            log.error(`❌ Error consultando la API: ${err.message}`);
            return null;
        }
    } else {
        log.error(`❌ Método HTTP no soportado: ${metodo}`);
        return null;
    }
}

module.exports = { extractApiInfo };