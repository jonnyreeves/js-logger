import { JSLoggerDefaultsType, JSLoggerExportType, ILogLevel, ILogger, IContext, LogHandler, ILoggerOpts } from "./datatypes";
export * from "./datatypes";
import { bind, defineLogLevel, merge } from "./utils";
import { JSLoggerDefaults, globalLogger } from "./JSLoggerDefaults"



export const Logger: JSLoggerExportType = (function () {
	// Copy properties from `JSLoggerDefaults` onto `globalLogger` in order to create the combined export object
	for (const key in JSLoggerDefaults) {
		(globalLogger as any)[key] = (JSLoggerDefaults as any)[key];
	}

	return globalLogger as any;
})();


// For those that are at home that are keeping score.
// Logger.VERSION = "1.4.1";


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


