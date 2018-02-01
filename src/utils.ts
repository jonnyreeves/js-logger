import { ILogLevel } from "./datatypes";

// Helper to define a logging level object; helps with optimisation.
export const defineLogLevel = function(value: number, name: string): ILogLevel {
  return { value, name };
};

// Polyfill for ES5's Function.bind.
// Can't be more specific than `Function` here with a single line type
// tslint:disable-next-line
export const bind = function<T extends Function>(scope: any, func: T): T { 
  return function() {
    return func.apply(scope, arguments);
  } as any;
};
