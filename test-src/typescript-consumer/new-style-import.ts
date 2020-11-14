import jsLogger, { ILogger } from "js-logger";

export default () => {
  jsLogger.useDefaults();
  const myLogger: ILogger = jsLogger.get("myLogger");
  myLogger.info("Yay Typescript!");
};
