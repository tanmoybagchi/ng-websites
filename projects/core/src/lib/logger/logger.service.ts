import { LogLevel, LoggerConfig } from './logger-config';

export class LoggerService {
  private debugEnabled: boolean;
  private infoEnabled: boolean;
  private warnEnabled: boolean;
  private errorEnabled: boolean;
  private fatalEnabled: boolean;

  constructor(config: LoggerConfig) {
    if (!config || !('logLevel' in config)) {
      throw new Error('Must configure.');
    }

    switch (+config.logLevel) {
      case LogLevel.Debug:
        this.debugEnabled = true;
        break;
      case LogLevel.Info:
        this.infoEnabled = true;
        break;
      case LogLevel.Warn:
        this.warnEnabled = true;
        break;
      case LogLevel.Error:
        this.errorEnabled = true;
        break;
      case LogLevel.Fatal:
        this.fatalEnabled = true;
        break;
    }
  }

  protected logWriter(logType: string, ...logArgs: any[]): void { }

  // tslint:disable-next-line:no-unused-expression
  debug(message: any): void { this.debugEnabled && this.logWriter('debug', message); }
  // tslint:disable-next-line:no-unused-expression
  info(message: any): void { this.infoEnabled && this.logWriter('info', message); }
  // tslint:disable-next-line:no-unused-expression
  warn(message: any): void { this.warnEnabled && this.logWriter('warn', message); }
  // tslint:disable-next-line:no-unused-expression
  error(message: any): void { this.errorEnabled && this.logWriter('error', message); }
  // tslint:disable-next-line:no-unused-expression
  fatal(message: any): void { this.fatalEnabled && this.logWriter('error', message); }
}
