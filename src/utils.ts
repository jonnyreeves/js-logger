import { ILogLevel } from "./datatypes";

// Helper to define a logging level object; helps with optimisation.
export const defineLogLevel = function(value: number, name: string): ILogLevel {
	return { value: value, name: name };
};

// Polyfill for ES5's Function.bind.
export const bind = function<T extends Function>(scope: any, func: T): T {
	return function() {
		return func.apply(scope, arguments);
	} as any;
};

// Super exciting object merger-matron 9000 adding another 100 bytes to your download.
export const merge = function (...p: any[]) {
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