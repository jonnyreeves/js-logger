/**
 * Note that as a consumer, you would import jsLogger and its
 * types using the following syntax:
 *
 *  import jsLogger, {
 *      ILogger
 *  } from 'js-logger';
 *
 */
import jsLogger, {
    ILogger
 } from '../../';

jsLogger.useDefaults();
const myLogger: ILogger = jsLogger.get('myLogger');
myLogger.info('Yay Typescript!');
