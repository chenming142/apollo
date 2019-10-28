import Logging from 'loglevel';
import prefixer from 'loglevel-plugin-prefix';
import chalk from 'chalk';

const __colors__ = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

Logging.enableAll();

prefixer.apply(Logging, {
  nameFormatter(name) {
    return name || 'default';
  },
  format(level, name, timestamp) {
    return `${chalk.gray(`[${timestamp}]`)} ${__colors__[level.toUpperCase()](level)} ${chalk.green(`${name}:`)}`;
  },
});


export default Logging;