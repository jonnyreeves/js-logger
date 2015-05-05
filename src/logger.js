/*!
 * js-logger - http://github.com/jonnyreeves/js-logger 
 * Jonny Reeves, http://jonnyreeves.co.uk/
 * js-logger may be freely distributed under the MIT license. 
 */

/*jshint sub:true*/
/*global console:true,define:true,module:true,Components:true,XPCNativeWrapper:true,require:true*/
(function (global) {
	"use strict";

	// Top level module for the global, static logger instance.
	var Logger = { };
	
	// For those that are at home that are keeping score.
    Logger.VERSION = "0.9.15";

    // Detect Mozilla's Add-on SDK environment
    var isJetpack = (function (strict) {
        try {
            void( Components );
        } catch (error) {
            //noinspection JSUnresolvedVariable
            if (error.fileName === 'resource://gre/modules/commonjs/toolkit/loader.js')
                return true;
        }

        var jetEnv = (typeof(XPCNativeWrapper) !== 'undefined' && typeof(require) !== 'undefined');
        if (jetEnv) {
            if (!strict)
                return true;
            else {
                try {
                    //noinspection JSUnresolvedVariable
                    return require('sdk/system').vendor === 'Mozilla';
                }
                catch (error) {
                    return false;
                }
            }
        }
        return false;
    })(false);

    // Setup support for the SDK env
    if (isJetpack) {
        var jetId = require('sdk/self').id;
        Logger.jetpack = {
            logLevel: 'extensions.' + jetId + '.sdk.console.loglevel',
            set: require('sdk/preferences/service').set
        };
    }
	
	// Function which handles all incoming log messages.
	var logHandler;
	
	// Map of ContextualLogger instances by name; used by Logger.get() to return the same named instance.
	var contextualLoggersByNameMap = {};
	
	// Polyfill for ES5's Function.bind.
	var bind = function(scope, func) {
		return function() {
			return func.apply(scope, arguments);
		};
	};

	// Super exciting object merger-matron 9000 adding another 100 bytes to your download.
	var merge = function () {
		var args = arguments, target = args[0], key, i;
		for (i = 1; i < args.length; i++) {
			for (key in args[i]) {
				if (!(key in target) && args[i].hasOwnProperty(key)) {
					target[key] = args[i][key];
				}
			}
		}
		return target;
	};

	// Helper to define a logging level object; helps with optimisation.
	var defineLogLevel = function(value, name) {
		return { value: value, name: name };
	};

	// Predefined logging levels.
    Logger.DEBUG = defineLogLevel(1, 'debug');
    Logger.INFO = defineLogLevel(2, 'info');
    Logger.WARN = defineLogLevel(4, 'warn');
    Logger.ERROR = defineLogLevel(8, 'error');
    Logger.OFF = defineLogLevel(99, 'off');

	// Inner class which performs the bulk of the work; ContextualLogger instances can be configured independently
	// of each other.
	var ContextualLogger = function(defaultContext) {
		this.context = defaultContext;
		this.setLevel(defaultContext.filterLevel);
		this.log = this.info;  // Convenience alias.
	};

    // ContextualLogger.prototype method, moved here for optimization
    var setLevel = function (newLevel) {
        // Ensure the supplied Level object looks valid.
        if (newLevel && "value" in newLevel) {
            this.context.filterLevel = newLevel;
        }
    };

	ContextualLogger.prototype = {
		// Changes the current logging level for the logging instance.
        setLevel: isJetpack ? function (newLevel) {
            if (newLevel && "value" in newLevel) {
                Logger.jetpack.set(Logger.jetpack.logLevel, newLevel.value);
                this.context.filterLevel = newLevel;
            }
        } : setLevel,

		// Is the logger configured to output messages at the supplied level?
		enabledFor: function (lvl) {
			var filterLevel = this.context.filterLevel;
			return lvl.value >= filterLevel.value;
		},

		debug: function () {
			this.invoke(Logger.DEBUG, arguments);
		},

		info: function () {
			this.invoke(Logger.INFO, arguments);
		},

		warn: function () {
			this.invoke(Logger.WARN, arguments);
		},

		error: function () {
			this.invoke(Logger.ERROR, arguments);
		},

		// Invokes the logger callback if it's not being filtered.
		invoke: function (level, msgArgs) {
			if (logHandler && this.enabledFor(level)) {
				logHandler(msgArgs, merge({ level: level }, this.context));
			}
		}
	};

	// Protected instance which all calls to the to level `Logger` module will be routed through.
	var globalLogger = new ContextualLogger({ filterLevel: Logger.OFF });

	// Configure the global Logger instance.
	(function() {
		// Shortcut for optimisers.
		var L = Logger;

		L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
		L.debug = bind(globalLogger, globalLogger.debug);
		L.info = bind(globalLogger, globalLogger.info);
		L.warn = bind(globalLogger, globalLogger.warn);
		L.error = bind(globalLogger, globalLogger.error);

		// Don't forget the convenience alias!
		L.log = L.info;
	}());

	// Set the global logging handler.  The supplied function should expect two arguments, the first being an arguments
	// object with the supplied log messages and the second being a context object which contains a hash of stateful
	// parameters which the logging function can consume.
	Logger.setHandler = function (func) {
		logHandler = func;
	};

	// Sets the global logging filter level which applies to *all* previously registered, and future Logger instances.
	// (note that named loggers (retrieved via `Logger.get`) can be configured independently if required).
	Logger.setLevel = function(level) {
		// Set the globalLogger's level.
		globalLogger.setLevel(level);

		// Apply this level to all registered contextual loggers.
		for (var key in contextualLoggersByNameMap) {
			if (contextualLoggersByNameMap.hasOwnProperty(key)) {
				contextualLoggersByNameMap[key].setLevel(level);
			}
		}
	};

	// Retrieve a ContextualLogger instance.  Note that named loggers automatically inherit the global logger's level,
	// default context and log handler.
	Logger.get = function (name) {
		// All logger instances are cached so they can be configured ahead of use.
		return contextualLoggersByNameMap[name] ||
			(contextualLoggersByNameMap[name] = new ContextualLogger(merge({ name: name }, globalLogger.context)));
	};

	// Configure and example a Default implementation which writes to the `window.console` (if present).
	Logger.useDefaults = function(defaultLevel) {
		// Check for the presence of a logger.
		if (typeof console === "undefined") {
			return;
		}

		Logger.setLevel(defaultLevel || Logger.DEBUG);
		Logger.setHandler(function(messages, context) {
			var hdlr = console.log;

			// Prepend the logger's name to the log message for easy identification.
			if (context.name) {
				messages[0] = "[" + context.name + "] " + messages[0];
			}

			// Delegate through to custom warn/error loggers if present on the console.
			if (context.level === Logger.WARN && console.warn) {
				hdlr = console.warn;
			} else if (context.level === Logger.ERROR && console.error) {
				hdlr = console.error;
			} else if (context.level === Logger.INFO && console.info) {
				hdlr = console.info;
			}

			// Support for IE8+ (and other, slightly more sane environments)
			Function.prototype.apply.call(hdlr, console, messages);
		});
	};

	// Export to popular environments boilerplate.
	if (typeof define === 'function' && define.amd) {
		define(Logger);
	}
	else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Logger;
	}
	else {
		Logger._prevLogger = global.Logger;

		Logger.noConflict = function () {
			global.Logger = Logger._prevLogger;
			return Logger;
		};

		global.Logger = Logger;
    }
}(this));