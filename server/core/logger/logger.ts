import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

/**
 * App Logger based on winston
 */
export default class Logger {

  private static _instance: Logger;

  private winstonLogger;

  /**
   * Init logger by env settings. Info as default log level on console and file
   */
  private constructor() {

    const tsFormat = () => (new Date().toLocaleString()),
      fileLogsFolder = path.relative(process.cwd(), process.env.SERVER_LOGS_FOLDER || 'server/logs'), // server/logs crashes the build
      completeFileName = path.join(fileLogsFolder, process.env.SERVER_LOGS_FILE_NAME || 'server.log'),
      completeExceptionsFileName = path.join(fileLogsFolder, process.env.SERVER_LOGS_EXCEPTIONS_FILE_NAME || 'exceptions.log'),
      consoleLevel = process.env.SERVER_LOGS_CONSOLE_LEVEL || 'info',
      fileLevel = process.env.SERVER_LOGS_FILE_LEVEL || 'info';

    // Create the log directory if it does not exist
    if (!fs.existsSync(fileLogsFolder)) {
      fs.mkdirSync(fileLogsFolder);
    }

    this.winstonLogger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          timestamp: tsFormat,
          colorize: true,
          level: consoleLevel
        }),
        new (winston.transports.File)({
          filename: completeFileName,
          timestamp: tsFormat,
          json: false,
          level: fileLevel
        })
      ]
    });

    winston.handleExceptions(new winston.transports.File({
      filename: completeExceptionsFileName,
      timestamp: tsFormat,
      handleExceptions: true,
      humanReadableUnhandledException: true
    }));

    this.winstonLogger.info('[Logger] Init app logger');

    this.winstonLogger.info('[Logger] Logger configuration');
    this.winstonLogger.info('[Logger] fileLogsFolder: ' + fileLogsFolder);
    this.winstonLogger.info('[Logger] logFileName: ' + completeFileName);
    this.winstonLogger.info('[Logger] exceptionsFileName: ' + completeExceptionsFileName);
    this.winstonLogger.info('[Logger] consoleLevel: ' + consoleLevel);
    this.winstonLogger.info('[Logger] fileLevel: ' + fileLevel);
  }

  /**
   * Get Logger Istance
  */
  public static get instance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance.winstonLogger;
  }
}
