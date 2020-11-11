export interface ILogger {
    TRACE: ILogLevel;
    DEBUG: ILogLevel;
    INFO: ILogLevel;
    TIME: ILogLevel;
    WARN: ILogLevel;
    ERROR: ILogLevel;
    OFF: ILogLevel;

    trace(...x: any[]): void;
    debug(...x: any[]): void;
    info(...x: any[]): void;
    log(...x: any[]): void;
    warn(...x: any[]): void;
    error(...x: any[]): void;
    time(label: string): void;
    timeEnd(label: string): void;

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

    enabledFor(level: ILogLevel): boolean;
}

export interface GlobalLogger extends ILogger {
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
    setHandler(logHandler: ILogHandler): void;

    /**
     * Retrieve a ContextualLogger instance.  Note that named loggers automatically
     * inherit the global logger's level, default context and log handler.
     *
     * @param  {string}  name the logger name
     * @return {ILogger}      the named logger
     */
    get(name: string): ILogger;

    /**
     * CreateDefaultHandler returns a handler function which can be passed to `Logger.setHandler()` which will
     * write to the window's console object (if present); the optional options object can be used to customise the
     * formatter used to format each log message.
     */
    createDefaultHandler(options?: CreateDefaultHandlerOptions): ILogHandler;
}

export interface ILogHandler {
    (messages: any[], context: IContext): void
}

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

interface CreateDefaultHandlerOptions {
    formatter?: ILogHandler;
}

export interface ILoggerOpts extends Object {
    defaultLevel?: ILogLevel;
    formatter?: ILogHandler;
}

declare const Logger: GlobalLogger;

/**
 * Configure and example a Default implementation which writes to the
 * `window.console` (if present). The `options` hash can be used to configure
 * the default logLevel and provide a custom message formatter.
 */
export function useDefaults(options ?: ILoggerOpts): void;

/**
 * alias to useDefaults.
 */
export function setDefaults(options ?: ILoggerOpts): void;

/**
* Set the global logging handler. The supplied function should
* expect two arguments, the first being an arguments object with the
* supplied log messages and the second being a context object which
* contains a hash of stateful parameters which the logging function can consume.
* @param  {setHandlerCallback} callback the callback which handles the logging
*/
export function setHandler(logHandler: ILogHandler): void;

/**
 * Retrieve a ContextualLogger instance.  Note that named loggers automatically
 * inherit the global logger's level, default context and log handler.
 *
 * @param  {string}  name the logger name
 * @return {ILogger}      the named logger
 */
export function get(name: string): ILogger;

/**
 * CreateDefaultHandler returns a handler function which can be passed to `Logger.setHandler()` which will
 * write to the window's console object (if present); the optional options object can be used to customise the
 * formatter used to format each log message.
 */
export function createDefaultHandler(options ?: CreateDefaultHandlerOptions): ILogHandler;

export default Logger;
