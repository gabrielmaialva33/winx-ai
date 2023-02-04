import chalk from 'chalk'

export class Logger {
  public static info(message: string, context: string) {
    console.log(
      `${chalk.bgGreen(`${chalk.black.bold('[INFO]')}`)} ${chalk.blue(`(${context})`)} ${message}`
    )
  }

  public static error(message: string | unknown, context: string) {
    console.log(
      `${chalk.bgRed(`${chalk.black.bold('[ERROR]')}`)} ${chalk.blue(`(${context})`)} ${message}`
    )
  }

  public static warn(message: string, context: string) {
    console.log(
      `${chalk.bgYellow(`${chalk.black.bold('[WARN]')}`)} ${chalk.blue(`(${context})`)} ${message}`
    )
  }

  public static debug(message: string, context: string) {
    console.log(
      `${chalk.bgBlue(`${chalk.black.bold('[DEBUG]')}`)} ${chalk.blue(`(${context})`)} ${message}`
    )
  }
}
