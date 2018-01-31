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
