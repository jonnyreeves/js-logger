import { IContext, IJSLoggerDefaultsType, ILogger, ILoggerOpts, ILogLevel, JSLoggerExportType, LogHandler } from "./datatypes";
export * from "./datatypes";
import { JSLoggerDefaults as Logger } from "./JSLoggerDefaults";
import { bind, defineLogLevel } from "./utils";

// Inner class which performs the bulk of the work; ContextualLogger instances can be configured independently
// of each other.
export class ContextualLogger implements ILogger {
  public readonly context: IContext;

  public constructor(defaultContext: IContext) {
    this.context = defaultContext;
    this.setLevel(defaultContext.level);
  }

  // Changes the current logging level for the logging instance.
  public setLevel(newLevel: ILogLevel) {
    // Ensure the supplied Level object looks valid.
    if (newLevel && "value" in newLevel) {
      this.context.level = newLevel;
    }
  }

  // Gets the current logging level for the logging instance
  public getLevel() {
    return this.context.level;
  }

  // Is the logger configured to output messages at the supplied level?
  public enabledFor(lvl: ILogLevel) {
    const filterLevel = this.context.level;
    return lvl.value >= filterLevel.value;
  }

  public log() {
    this.info.apply(this, arguments);
  }

  public trace() {
    this.invoke(Logger.TRACE, arguments);
  }

  public debug() {
    this.invoke(Logger.DEBUG, arguments);
  }

  public info() {
    this.invoke(Logger.INFO, arguments);
  }

  public warn() {
    this.invoke(Logger.WARN, arguments);
  }

  public error() {
    this.invoke(Logger.ERROR, arguments);
  }

  public time(label: string) {
    if (typeof label === "string" && label.length > 0) {
      this.invoke(Logger.TIME, [ label, "start" ]);
    }
  }

  public timeEnd(label: string) {
    if (typeof label === "string" && label.length > 0) {
      this.invoke(Logger.TIME, [ label, "end" ]);
    }
  }

  // Invokes the logger callback if it's not being filtered.
  public invoke(level: ILogLevel, msgArgs: any) {
    if (Logger.logHandler && this.enabledFor(level)) {
      Logger.logHandler(msgArgs, { ...this.context, level });
    }
  }
}
