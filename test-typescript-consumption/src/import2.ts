import Logger from 'js-logger';

console.log(Logger.VERSION);

const logger = Logger.get(`testLogger`);

logger.info(`test message`);
