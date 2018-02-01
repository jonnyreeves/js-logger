import { IContext, IJSLoggerDefaultsType, ILogger, ILoggerOpts, ILogLevel, JSLoggerExportType, LogHandler } from "./datatypes";
export * from "./datatypes";
import { globalLogger, JSLoggerDefaults } from "./JSLoggerDefaults";
import { bind, defineLogLevel } from "./utils";

const boundGlobalLoggerFunctions: ILogger = {
  enabledFor: bind(globalLogger, globalLogger.enabledFor),
  trace: bind(globalLogger, globalLogger.trace),
  debug: bind(globalLogger, globalLogger.debug),
  time: bind(globalLogger, globalLogger.time),
  timeEnd: bind(globalLogger, globalLogger.timeEnd),
  info: bind(globalLogger, globalLogger.info),
  warn: bind(globalLogger, globalLogger.warn),
  error: bind(globalLogger, globalLogger.error),
  log: bind(globalLogger, globalLogger.info),
  getLevel: bind(globalLogger, globalLogger.getLevel),
  setLevel: () => { /* */ }, // will be overwritten
};

export const Logger: JSLoggerExportType = { ...boundGlobalLoggerFunctions, ...JSLoggerDefaults };

// For those that are at home that are keeping score.
// Logger.VERSION = "1.4.1";

if (typeof window !== "undefined") {
  if (!(window as any).Logger) {
    (window as any).Logger = Logger;
  }
}
