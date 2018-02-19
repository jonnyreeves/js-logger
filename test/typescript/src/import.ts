import jslogger, { IContext, ILogger, LogHandler } from '../../..';

jslogger.useDefaults();
jslogger.info('hello world!');
jslogger.error('bang!');

const namedLogger: ILogger = jslogger.get('myLogger');
namedLogger.info('hello from namedLogger :)');

// Install a custom log handler which pushes to an Array instead of
// writing to the console.
const receivedMessages: any[] = [];
const customHandler: LogHandler =  (messages: any[], context: IContext) => {
    receivedMessages.push(messages);
}
jslogger.setHandler(customHandler);
jslogger.info('custom handler test');
 receivedMessages.forEach(element => {
     console.log('received message', ...element);
 });

 // Install a custom log handler, based on the default one which prefixes
 // all log messages before writing to the console.
 const prefixedDefaultHandler: LogHandler = jslogger.createDefaultHandler({
     formatter: (messages: any[], context: IContext) => {
         messages.unshift('my_prefix');
     }
 })
 jslogger.setHandler(prefixedDefaultHandler);
 jslogger.info('prefixed handler test');
