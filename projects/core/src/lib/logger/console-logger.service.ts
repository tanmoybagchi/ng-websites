import { Injectable } from '@angular/core';
import { LoggerConfig } from './logger-config';
import { LoggerService } from './logger.service';

@Injectable({ providedIn: 'root' })
export class ConsoleLoggerService extends LoggerService {
  // Support: IE 9-11, Edge 12-14+
  // IE/Edge display errors in such a way that it requires the user to click in 4 places
  // to see the stack trace. There is no way to feature-detect it so there's a chance
  // of the user agent sniffing to go wrong but since it's only about logging, this shouldn't
  // break apps. Other browsers display errors in a sensible way and some of them map stack
  // traces along source maps if available so it makes sense to let browsers display it
  // as they want.
  private formatStackTrace: boolean;

  constructor(config: LoggerConfig) {
    super(config);

    const msie = window.document['documentMode'];
    this.formatStackTrace = msie || /\bEdge\//.test(window.navigator && window.navigator.userAgent);
  }

  private formatError(arg: any) {
    if (arg instanceof Error) {
      if (arg.stack && this.formatStackTrace) {
        arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
          ? 'Error: ' + arg.message + '\n' + arg.stack
          : arg.stack;
      } else if ('sourceURL' in arg) {
        arg = arg['message'] + '\n' + arg['sourceURL'] + ':' + arg['line'];
      }
    }

    return arg;
  }

  protected logWriter(logType: string, ...logArgs: any[]) {
    if (!window.console) {
      return;
    }

    const console = window.console;
    const logFn = console[logType] || console.log;
    let hasApply = false;

    // Note: reading logFn.apply throws an error in IE11 in IE8 document mode.
    // The reason behind this is that console.log has type "object" in IE8...
    try {
      hasApply = !!logFn.apply;
    } catch (e) { /* empty */ }

    if (hasApply) {
      const args = logArgs.map(arg => this.formatError(arg));

      logFn.apply(console, args);

      return;
    }

    // we are IE which either doesn't have window.console => this is noop and we do nothing,
    // or we are IE where console.log doesn't have apply so we log at least first args
    logFn(logArgs[0]);
  }
}
