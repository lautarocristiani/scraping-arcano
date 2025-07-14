const chalk = require('chalk');

const log = {
    step: (msg) => console.log(chalk.blueBright(`${msg}`)),
    success: (msg) => console.log(chalk.green(`${msg}`)),
    warn: (msg) => console.log(chalk.yellow(`${msg}`)),
    error: (msg) => console.log(chalk.red(`${msg}`)),
    spell: (msg) => console.log(chalk.magenta(`${msg}`)),
    ritual: (msg) => console.log(chalk.cyan(`${msg}`)),
    divider: (msg) => console.log(chalk.gray(`\n━━${msg} ━━━`)),
    final: (msg) => console.log(chalk.gray(`${msg}`)),
};

module.exports = { log };