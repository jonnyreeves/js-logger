/**
 * @module js-logger
 * @description Typescript description for js-logger
 */

interface ILogLevel extends Object {
  /**
   * The numerical representation of the level
   */
  value: number;
  /**
   * Human readable name of the log level
   */
  name: string;
}

interface IContext extends Object {
  /**
   * The currrent log level
   */
  level: ILogLevel;
  /**
   * The optional current logger name
   */
  name?: string;
}

/**
 * Defines custom formatter for the log message
 * @callback formatterCallback
 * @param  {any[]}    messages the given logger arguments
 * @param  {IContext} context  the current logger context (level and name)
 */

interface ILoggerOpts extends Object {
  /**
   * The log level, default is DEBUG
   */
  logLevel?: ILogLevel;
  /**
   * Defines custom formatter for the log message
   * @param  {formatterCallback} callback the callback which handles the formatting
   */
  formatter?: (messages: any[], context: IContext) => void;
}

/**
 * Defines custom handler for the log message
 * @callback setHandlerCallback
 * @param  {any[]}    messages the given logger arguments
 * @param  {IContext} context  the current logger context (level and name)
 */

interface ILogger {
  DEBUG: ILogLevel;
  INFO: ILogLevel;
  TIME: ILogLevel;
  WARN: ILogLevel;
  ERROR: ILogLevel;
  OFF: ILogLevel;

  debug(...x: any[]): void;
  info(...x: any[]): void;
  log(...x: any[]): void;
  warn(...x: any[]): void;
  error(...x: any[]): void;

  /**
   * Configure and example a Default implementation which writes to the
   * `window.console` (if present). The `options` hash can be used to configure
   * the default logLevel and provide a custom message formatter.
   */
  useDefaults(options?: ILoggerOpts): void;

  /**
   * Sets the global logging filter level which applies to *all* previously
   * registered, and future Logger instances. (note that named loggers (retrieved
   * via `Logger.get`) can be configured independently if required).
   *
   * @param  {ILogLevel} level the level to switch to
   */
  setLevel(level: ILogLevel): void;
  /**
   * Gets the global logging filter level
   *
   * @return {ILogLevel} the current logging level
   */
  getLevel(): ILogLevel;
   /**
   * Set the global logging handler. The supplied function should
   * expect two arguments, the first being an arguments object with the
   * supplied log messages and the second being a context object which
   * contains a hash of stateful parameters which the logging function can consume.
   * @param  {setHandlerCallback} callback the callback which handles the logging
   */
  setHandler(logHandler: (messages: any[], context: IContext) => void): void;
  /**
   * Retrieve a ContextualLogger instance.  Note that named loggers automatically
   * inherit the global logger's level, default context and log handler.
   *
   * @param  {string}  name the logger name
   * @return {ILogger}      the named logger
   */
  get(name: string): ILogger;
  time(label: string): void;
  timeEnd(label: string): void;
  enabledFor(level: ILogLevel): boolean;
  createDefaultHandler(options?: ILoggerOpts): (messages: any[], context: IContext) => void;
}

declare var Logger: ILogger;
export = Logger;
