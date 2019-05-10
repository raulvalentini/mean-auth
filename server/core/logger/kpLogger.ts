import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import LogParameter from './models/logParameter';

/**
 * Simplified Logger based on winston
 */
export default class KpLogger {

  private static _instance: KpLogger;

  private winstonLogger;
  private loggerList: any;
  private allDestinations: string[];

  /**
   * Init logger by env settings
   */
  private constructor() {

    const tsFormat = () => (new Date().toLocaleString()),
      fileLogsFolder = path.relative(process.cwd(), process.env.SERVER_LOGS_FOLDER || 'logs'),
      completeFileName = path.join(fileLogsFolder, process.env.SERVER_LOGS_FILE_NAME || 'server.log'),
      completeUserLogFileName = path.join(fileLogsFolder, process.env.SERVER_USER_LOGS_FILE_NAME || 'user_management.log'),
      completeExceptionsFileName = path.join(fileLogsFolder, process.env.SERVER_LOGS_EXCEPTIONS_FILE_NAME || 'exceptions.log'),
      consoleLevel = process.env.SERVER_LOGS_CONSOLE_LEVEL || 'info',
      fileLevel = process.env.SERVER_LOGS_FILE_LEVEL || 'info';

    // Create the log directory if it does not exist
    if (!fs.existsSync(fileLogsFolder)) {
      fs.mkdirSync(fileLogsFolder);
    }

    this.allDestinations = [
      'console',
      'file',
      'user'
    ];
    this.loggerList = {
      console: new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: consoleLevel
          })
        ]
      }),
      file: new (winston.Logger)({
        transports: [
          new (winston.transports.File)({
            filename: completeFileName,
            timestamp: tsFormat,
            json: false,
            level: fileLevel
          })
        ]
      }),
      user: new (winston.Logger)({
        transports: [
          new (winston.transports.File)({
            filename: completeUserLogFileName,
            timestamp: tsFormat,
            json: false,
            level: fileLevel
          })
        ]
      }),
    };

    this.winstonLogger = new (winston.Logger);

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
   * Wrap info method of winstonlogger adding destination loggers array as parameter
   * @param params logger parameters
   * @param destinations string array containing destination logger names
   */
  public info(params: string | LogParameter, destinations?: string[]) {
    if (!_.isNil(destinations)) {
      this.log(params, 'info', destinations);
    } else {
      this.log(params, 'info');
    }
  }

  /**
   * Wrap debug method of winstonlogger adding destination loggers array as parameter
   * @param params logger parameters
   * @param destinations string array containing destination logger names
   */  public debug(params: string | LogParameter, destinations?: string[]) {
    if (!_.isNil(destinations)) {
      this.log(params, 'debug', destinations);
    } else {
      this.log(params, 'debug');
    }
  }

  /**
   * Wrap warn method of winstonlogger adding destination loggers array as parameter
   * @param params logger parameters
   * @param destinations string array containing destination logger names
   */
  public warn(params: string | LogParameter, destinations?: string[]) {
    if (!_.isNil(destinations)) {
      this.log(params, 'warn', destinations);
    } else {
      this.log(params, 'warn');
    }
  }

  /**
   * Wrap error method of winstonlogger adding destination loggers array as parameter
   * @param params logger parameters
   * @param destinations string array containing destination logger names
   */  public error(params: string | LogParameter, destinations?: string[]) {
    if (!_.isNil(destinations)) {
      this.log(params, 'error', destinations);
    } else {
      this.log(params, 'error');
    }
  }

  /**
   * Compose message string if needed and send it to selected loggers
   * @param params logger parameters or message string
   * @param level logger level
   * @param destinations optional - array of logger names, defaults to all
   */
  private log(params: string | LogParameter, level: string, destinations?: string[]) {
    let message: string;
    const outcome = this.getOutcomeFromLevel(level);

    if (typeof params === 'string') {
      message = params;
    } else {
      message = `User: ${params.user} | Action: ${params.action} | Outcome: ${outcome}`;
    }

    if (!destinations || destinations.length === 0) {
      destinations = this.allDestinations;
    }

    // for each destination set in dest array, log through corresponding logger
    destinations.map(dest => {
      // select appropriate logger from list
      const logger = this.loggerList[dest];
      switch (level) {
        case 'info':
          logger.info(message);
          break;
        case 'warn':
          logger.warn(message);
          break;
        case 'debug':
          logger.debug(message);
          break;
        case 'error':
          logger.error(message);
          break;
        case 'default':
          logger.info(message);
          break;
      }
    });

  }

  /**
   * Extracts outcome message from chosen logger level
   */
  private getOutcomeFromLevel(level: string) {
    let outcome: string;
    switch (level) {
      case 'info':
        outcome = 'Success';
        break;
      case 'error':
        outcome = 'Error';
        break;
      default:
        outcome = '';
        break;
    }
    return outcome;
  }

  /**
   * Return logger instance
  */
  public static get instance() {
    if (!this._instance) {
      this._instance = new this();
    }
    return this._instance;
  }
}
