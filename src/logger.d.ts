/**
 * @module
 * @description
 * Starting point to import logger API.
 */

interface ILogger {
    useDefaults(): void;
    debug(x: any): void;
    info(x: any): void;
    warn(x: any): void;
    error(x: any): void;
    setLevel(x: any): void;
    setHandler(x: any): void;
    get(x: any): any;
    time(x: any): void;
    timeEnd(x: any): void;
  }

declare var Logger: ILogger;
export = Logger;
