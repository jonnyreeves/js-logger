/**
 * Note that as a consumer, you would import jsLogger and its
 * types using the following syntax:
 *
 *	import * as jsLogger from 'js-logger';
 * 	import { ILogger } from 'js-logger/src/types';
 */
import * as jsLogger from '../../';
import { ILogger } from '../../src/types'

jsLogger.useDefaults();
const myLogger: ILogger = jsLogger.get('myLogger');
jsLogger.info('Yay Typescript!');