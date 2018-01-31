import { IBaseLogger, ILogLevel, ILogger, IContext, LogHandler, ILoggerOpts } from "./datatypes";
import { bind, defineLogLevel, merge } from "./utils";
  
// Function which handles all incoming log messages.
let logHandler: LogHandler | undefined;

// Top level module for the global, static logger instance.
const Logger: IBaseLogger = {
	// Predefined logging levels.
	TRACE: defineLogLevel(1, 'TRACE'),
	DEBUG: defineLogLevel(2, 'DEBUG'),
	INFO: defineLogLevel(3, 'INFO'),
	TIME: defineLogLevel(4, 'TIME'),
	WARN: defineLogLevel(5, 'WARN'),
	ERROR: defineLogLevel(8, 'ERROR'),
	OFF: defineLogLevel(99, 'OFF'),
 } as any;

// For those that are at home that are keeping score.
// Logger.VERSION = "1.4.1";



// Map of ContextualLogger instances by name; used by Logger.get() to return the same named instance.
const contextualLoggersByNameMap: { [key: string]: ILogger | undefined } = {};

// Inner class which performs the bulk of the work; ContextualLogger instances can be configured independently
// of each other.
class ContextualLogger implements ILogger {
	public readonly context: IContext;

	public constructor(defaultContext: IContext) {
		this.context = defaultContext;
		this.setLevel(defaultContext.level);
	}

	// this.context = defaultContext;
	// this.setLevel(defaultContext.filterLevel);
	// this.log = this.info;  // Convenience alias.

	// Changes the current logging level for the logging instance.
	public setLevel(newLevel: ILogLevel) {
		// Ensure the supplied Level object looks valid.
		if (newLevel && "value" in newLevel) {
			this.context.level = newLevel;
		}
	}
	
	// Gets the current logging level for the logging instance
	public getLevel() {
		return this.context.level;
	}

	// Is the logger configured to output messages at the supplied level?
	public enabledFor(lvl: ILogLevel) {
		const filterLevel = this.context.level;
		return lvl.value >= filterLevel.value;
	}

	public log() {
		this.info.apply(this, arguments);
	}

	public trace() {
		this.invoke(Logger.TRACE, arguments);
	}

	public debug() {
		this.invoke(Logger.DEBUG, arguments);
	}

	public info() {
		this.invoke(Logger.INFO, arguments);
	}

	public warn() {
		this.invoke(Logger.WARN, arguments);
	}

	public error() {
		this.invoke(Logger.ERROR, arguments);
	}

	public time(label: string) {
		if (typeof label === 'string' && label.length > 0) {
			this.invoke(Logger.TIME, [ label, 'start' ]);
		}
	}

	public timeEnd(label: string) {
		if (typeof label === 'string' && label.length > 0) {
			this.invoke(Logger.TIME, [ label, 'end' ]);
		}
	}

	// Invokes the logger callback if it's not being filtered.
	public invoke(level: ILogLevel, msgArgs: any) {
		if (logHandler && this.enabledFor(level)) {
			logHandler(msgArgs, merge({ level: level }, this.context));
		}
	}
};

// Protected instance which all calls to the to level `Logger` module will be routed through.
const globalLogger = new ContextualLogger({ level: Logger.OFF });

// Configure the global Logger instance.
(function() {
	// Shortcut for optimisers.
	var L = Logger;

	L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
	L.trace = bind(globalLogger, globalLogger.trace);
	L.debug = bind(globalLogger, globalLogger.debug);
	L.time = bind(globalLogger, globalLogger.time);
	L.timeEnd = bind(globalLogger, globalLogger.timeEnd);
	L.info = bind(globalLogger, globalLogger.info);
	L.warn = bind(globalLogger, globalLogger.warn);
	L.error = bind(globalLogger, globalLogger.error);

	// Don't forget the convenience alias!
	L.log = L.info;
}());

// Set the global logging handler.  The supplied function should expect two arguments, the first being an arguments
// object with the supplied log messages and the second being a context object which contains a hash of stateful
// parameters which the logging function can consume.
Logger.setHandler = function (func: LogHandler) {
	logHandler = func;
};

// Sets the global logging filter level which applies to *all* previously registered, and future Logger instances.
// (note that named loggers (retrieved via `Logger.get`) can be configured independently if required).
Logger.setLevel = function(level: ILogLevel) {
	// Set the globalLogger's level.
	globalLogger.setLevel(level);

	// Apply this level to all registered contextual loggers.
	for (var key in contextualLoggersByNameMap) {
		const loggerForKey = contextualLoggersByNameMap[key];
		if (loggerForKey) {
			loggerForKey.setLevel(level);
		}
	}
};

// Gets the global logging filter level
Logger.getLevel = function() {
	return globalLogger.getLevel();
};

// Retrieve a ContextualLogger instance.  Note that named loggers automatically inherit the global logger's level,
// default context and log handler.
Logger.get = function (name: string): ILogger {
	// All logger instances are cached so they can be configured ahead of use.
	return contextualLoggersByNameMap[name] ||
		(contextualLoggersByNameMap[name] = new ContextualLogger(merge({ name: name }, globalLogger.context)));
};

// CreateDefaultHandler returns a handler function which can be passed to `Logger.setHandler()` which will
// write to the window's console object (if present); the optional options object can be used to customise the
// formatter used to format each log message.
Logger.createDefaultHandler = function (options: ILoggerOpts = {}) {
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

		if (context.level === Logger.TIME) {
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
			if (context.level === Logger.WARN && console.warn) {
				hdlr = console.warn;
			} else if (context.level === Logger.ERROR && console.error) {
				hdlr = console.error;
			} else if (context.level === Logger.INFO && console.info) {
				hdlr = console.info;
			} else if (context.level === Logger.DEBUG && console.debug) {
				hdlr = console.debug;
			} else if (context.level === Logger.TRACE && console.trace) {
				hdlr = console.trace;
			}

			if (!options.formatter) {
				throw new Error(`options.formatter undefined`); // not possible at the moment, see setter above
			}

			options.formatter(messages, context);
			invokeConsoleMethod(hdlr, messages);
		}
	};
};

// Configure and example a Default implementation which writes to the `window.console` (if present).  The
// `options` hash can be used to configure the default logLevel and provide a custom message formatter.
Logger.useDefaults = function(options) {
	Logger.setLevel(options && options.defaultLevel || Logger.DEBUG);
	Logger.setHandler(Logger.createDefaultHandler(options));
};

// Export to popular environments boilerplate.
// if (typeof define === 'function' && define.amd) {
// 	define(Logger);
// }
// else if (typeof module !== 'undefined' && module.exports) {
// 	module.exports = Logger;
// }
// else {
// 	Logger._prevLogger = global.Logger;

// 	Logger.noConflict = function () {
// 		global.Logger = Logger._prevLogger;
// 		return Logger;
// 	};

// 	global.Logger = Logger;
// }
