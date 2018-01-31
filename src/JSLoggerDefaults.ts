import { JSLoggerDefaultsType, JSLoggerExportType, ILogLevel, ILogger, IContext, LogHandler, ILoggerOpts } from "./datatypes";
export * from "./datatypes";
import { bind, defineLogLevel, merge } from "./utils";
import { ContextualLogger } from "./ContextualLogger";
  
// Function which handles all incoming log messages.
let logHandler: LogHandler | undefined;

// Map of ContextualLogger instances by name; used by Logger.get() to return the same named instance.
const contextualLoggersByNameMap: { [key: string]: ILogger | undefined } = {};

// Top level module for the global, static logger instance.
export const JSLoggerDefaults: JSLoggerDefaultsType = {
	// Predefined logging levels.
	TRACE: defineLogLevel(1, 'TRACE'),
	DEBUG: defineLogLevel(2, 'DEBUG'),
	INFO: defineLogLevel(3, 'INFO'),
	TIME: defineLogLevel(4, 'TIME'),
	WARN: defineLogLevel(5, 'WARN'),
	ERROR: defineLogLevel(8, 'ERROR'),
    OFF: defineLogLevel(99, 'OFF'),
    
    logHandler: undefined,

    // Set the global logging handler.  The supplied function should expect two arguments, the first being an arguments
    // object with the supplied log messages and the second being a context object which contains a hash of stateful
    // parameters which the logging function can consume.
    setHandler: function (func: LogHandler) {
        JSLoggerDefaults.logHandler = func;
    },
    
    // Sets the global logging filter level which applies to *all* previously registered, and future Logger instances.
    // (note that named loggers (retrieved via `Logger.get`) can be configured independently if required).
    setLevel: function(level: ILogLevel) {
        // Set the globalLogger's level.
        globalLogger.setLevel(level);

        // Apply this level to all registered contextual loggers.
        for (var key in contextualLoggersByNameMap) {
            const loggerForKey = contextualLoggersByNameMap[key];
            if (loggerForKey) {
                loggerForKey.setLevel(level);
            }
        }
    },
    
    // Gets the global logging filter level
    // getLevel = function() {
    //     return globalLogger.getLevel();
    // };
    
    // Retrieve a ContextualLogger instance.  Note that named loggers automatically inherit the global logger's level,
    // default context and log handler.
    get: function (name: string): ILogger {
        // All logger instances are cached so they can be configured ahead of use.
        return contextualLoggersByNameMap[name] ||
            (contextualLoggersByNameMap[name] = new ContextualLogger(merge({ name: name }, globalLogger.context)));
    },
    
    // CreateDefaultHandler returns a handler function which can be passed to `Logger.setHandler()` which will
    // write to the window's console object (if present); the optional options object can be used to customise the
    // formatter used to format each log message.
    createDefaultHandler: function (options: ILoggerOpts = {}) {
        // options = options || {};
    
        options.formatter = options.formatter || function defaultMessageFormatter(messages, context) {
            // Prepend the logger's name to the log message for easy identification.
            if (context.name) {
                messages.unshift("[" + context.name + "]");
            }
        };
    
        // Map of timestamps by timer labels used to track `#time` and `#timeEnd()` invocations in environments
        // that don't offer a native console method.
        const timerStartTimeByLabelMap: { [key: string]: number | undefined } = {};
    
        // Support for IE8+ (and other, slightly more sane environments)
        var invokeConsoleMethod = function (hdlr: LogHandler, messages: any[]) {
            Function.prototype.apply.call(hdlr, console, messages);
        };
    
        // Check for the presence of a logger.
        if (typeof console === "undefined") {
            return function () { /* no console */ };
        }
    
        return function(messages, context) {
            // Convert arguments object to Array.
            messages = Array.prototype.slice.call(messages);
    
            var hdlr = console.log;
            var timerLabel;
    
            if (context.level === JSLoggerDefaults.TIME) {
                timerLabel = (context.name ? '[' + context.name + '] ' : '') + messages[0];
    
                if (messages[1] === 'start') {
                    if (console.time) {
                        console.time(timerLabel);
                    }
                    else {
                        timerStartTimeByLabelMap[timerLabel] = new Date().getTime();
                    }
                }
                else {
                    if (console.timeEnd) {
                        console.timeEnd(timerLabel);
                    }
                    else {
                        invokeConsoleMethod(hdlr, [ timerLabel + ': ' +
                            (new Date().getTime() - (timerStartTimeByLabelMap[timerLabel] || 0)) + 'ms' ]);
                    }
                }
            }
            else {
                // Delegate through to custom warn/error loggers if present on the console.
                if (context.level === JSLoggerDefaults.WARN && console.warn) {
                    hdlr = console.warn;
                } else if (context.level === JSLoggerDefaults.ERROR && console.error) {
                    hdlr = console.error;
                } else if (context.level === JSLoggerDefaults.INFO && console.info) {
                    hdlr = console.info;
                } else if (context.level === JSLoggerDefaults.DEBUG && console.debug) {
                    hdlr = console.debug;
                } else if (context.level === JSLoggerDefaults.TRACE && console.trace) {
                    hdlr = console.trace;
                }
    
                if (!options.formatter) {
                    throw new Error(`options.formatter undefined`); // not possible at the moment, see setter above
                }
    
                options.formatter(messages, context);
                invokeConsoleMethod(hdlr, messages);
            }
        };
    },
    
    // Configure and example a Default implementation which writes to the `window.console` (if present).  The
    // `options` hash can be used to configure the default logLevel and provide a custom message formatter.
    useDefaults: function(options) {
        JSLoggerDefaults.setLevel(options && options.defaultLevel || JSLoggerDefaults.DEBUG);
        JSLoggerDefaults.setHandler(JSLoggerDefaults.createDefaultHandler(options));
    },
};

export const globalLogger = new ContextualLogger({ level: JSLoggerDefaults.OFF });