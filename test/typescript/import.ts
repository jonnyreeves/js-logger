import jslogger from '../..';

jslogger.useDefaults();
jslogger.info('hello world!');
jslogger.error('bang!');

const namedLogger = jslogger.get('myLogger');
namedLogger.info('hello from namedLogger :)');