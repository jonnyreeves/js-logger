export interface ILogLevel extends Object {
  /**
   * The numerical representation of the level
   */
  value: number;
  /**
   * Human readable name of the log level
   */
  name: string;
}

export interface IContext extends Object {
  /**
   * The currrent log level
   */
  level: ILogLevel;

  /**
   * The optional current logger name
   */
  name?: string;
}

export type LogHandler = (messages: any[], context: IContext) => void;

/**
 * Defines custom formatter for the log message
 * @callback formatterCallback
 * @param  {any[]}    messages the given logger arguments
 * @param  {IContext} context  the current logger context (level and name)
 */
export interface ILoggerOpts {
  /**
   * The log level, default is DEBUG
   */
  defaultLevel?: ILogLevel;

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
export interface ILogger {
  trace(...x: any[]): void;
  debug(...x: any[]): void;
  info(...x: any[]): void;
  log(...x: any[]): void;
  warn(...x: any[]): void;
  error(...x: any[]): void;

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

  time(label: string): void;
  timeEnd(label: string): void;

  enabledFor(level: ILogLevel): boolean;
}

export interface IJSLoggerDefaultsType {
  TRACE: ILogLevel;
  DEBUG: ILogLevel;
  INFO: ILogLevel;
  TIME: ILogLevel;
  WARN: ILogLevel;
  ERROR: ILogLevel;
  OFF: ILogLevel;

  // Function which handles all incoming log messages.
  logHandler: LogHandler | undefined;

  /**
   * Configure and example a Default implementation which writes to the
   * `window.console` (if present). The `options` hash can be used to configure
   * the default logLevel and provide a custom message formatter.
   */
  useDefaults(options?: ILoggerOpts): void;

  /**
   * Set the global logging handler. The supplied function should
   * expect two arguments, the first being an arguments object with the
   * supplied log messages and the second being a context object which
   * contains a hash of stateful parameters which the logging function can consume.
   * @param  {setHandlerCallback} callback the callback which handles the logging
   */
  setHandler(logHandler: LogHandler): void;

  /**
   * Retrieve a ContextualLogger instance.  Note that named loggers automatically
   * inherit the global logger's level, default context and log handler.
   *
   * @param  {string}  name the logger name
   * @return {ILogger}      the named logger
   */
  get(name: string): ILogger;

  createDefaultHandler(options?: ILoggerOpts): (messages: any[], context: IContext) => void;

  setLevel(level: ILogLevel): void;
}

export type JSLogger = IJSLoggerDefaultsType & ILogger & { readonly VERSION: string };
