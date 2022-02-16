const chalk = require("chalk");

const log = console.log;

// Show bold green text
function info(...text) {
    log(chalk.green.bold(text.join(' ')));
}

// Show yellow text on white background
function warn(...text) {
    log(chalk.bgWhite.yellow(text.join(' ')));
}

// Show underline red text
function error(...text) {
    log(chalk.underline.red(text.join(' ')));
}

module.exports = {
    info,
    warn,
    error
};
