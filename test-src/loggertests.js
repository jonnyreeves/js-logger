module("Logger", {
	setup: function () {
		this.calls = [];
		
		this.logFunc = function (messages, context) {
			this.calls.push({ messages: messages, context: context });
		};
		
		this.logger = window.Logger;
		this.logger.setHandler(this.logFunc.bind(this));
	}
});

test("Global Logger - Log messages routed to logger function", function () {
	var logger = this.logger;
	
	// Enable all log messages.
	logger.setLevel(logger.DEBUG);
	
	// Route some messages through to the logFunc.
	logger.debug("A debug message");
	logger.info("An info message");
	logger.warn("A warning message");
	logger.error("An error message");
	
	// Check they were received.
	equal(this.calls[0].messages[0], "A debug message");
	strictEqual(this.calls[0].context.level, logger.DEBUG);
	
	equal(this.calls[1].messages[0], "An info message");
	strictEqual(this.calls[1].context.level, logger.INFO);
	
	equal(this.calls[2].messages[0], "A warning message");
	strictEqual(this.calls[2].context.level, logger.WARN);
	
	equal(this.calls[3].messages[0], "An error message");
	strictEqual(this.calls[3].context.level, logger.ERROR);
});

test("Global Logger.enabledFor", function () {
	var logger = this.logger;
	
	logger.setLevel(logger.OFF);
	equal(logger.enabledFor(logger.DEBUG), false);
	equal(logger.enabledFor(logger.INFO), false);
	equal(logger.enabledFor(logger.WARN), false);
	equal(logger.enabledFor(logger.ERROR), false);	
	
	logger.setLevel(logger.DEBUG);
	equal(logger.enabledFor(logger.DEBUG), true);
	equal(logger.enabledFor(logger.INFO), true);
	equal(logger.enabledFor(logger.WARN), true);
	equal(logger.enabledFor(logger.ERROR), true);
	
	logger.setLevel(logger.INFO);
	equal(logger.enabledFor(logger.DEBUG), false);
	equal(logger.enabledFor(logger.INFO), true);
	equal(logger.enabledFor(logger.WARN), true);
	equal(logger.enabledFor(logger.ERROR), true);
	
	logger.setLevel(logger.WARN);
	equal(logger.enabledFor(logger.DEBUG), false);
	equal(logger.enabledFor(logger.INFO), false);
	equal(logger.enabledFor(logger.WARN), true);
	equal(logger.enabledFor(logger.ERROR), true);
	
	logger.setLevel(logger.ERROR);
	equal(logger.enabledFor(logger.DEBUG), false);
	equal(logger.enabledFor(logger.INFO), false);
	equal(logger.enabledFor(logger.WARN), false);
	equal(logger.enabledFor(logger.ERROR), true);
});

test("Named logger messages not routed to global logger", function () { 
	var logger = this.logger;
	var namedLogger = this.logger.get("getLogger");
	
	logger.setLevel(Logger.DEBUG);
	namedLogger.setLevel(Logger.DEBUG);
	
	namedLogger.info("Message via get logger");
	
	ok(this.calls.length === 1, "Log message was only routed via named logger.");
});

test("Named logger, same instance returned", function () { 
	strictEqual(this.logger.get("myLogger"), this.logger.get("myLogger"), "Exact same logger instance returned");
});

test("Named logger setLevel does not affect global logger", function () { 
	var named = this.logger.get("MyLogger");
	
	// Set the get logger at a lower level than the global logger.
	this.logger.setLevel(Logger.OFF);
	named.setLevel(Logger.DEBUG);
	
	named.debug("Debug message via nemd logger");
	this.logger.debug("Debug message via Global Logger");
	
	// Check the log message was routed correctly.
	ok(this.calls.length === 1, "LoggerFunc was invoked once");
	equal(this.calls[0].context.name, "MyLogger");
});

test("Logger.log convenience method", function () { 
	this.logger.setLevel(Logger.INFO);
	this.logger.log("log message");
	
	ok(this.calls.length === 1);
	strictEqual(this.calls[0].context.level, Logger.INFO, "Logger.log message routed at INFO level");
});

test("Named logger.log convenience method", function () { 
	var named = this.logger.get("logHelper");
	named.setLevel(Logger.INFO);
	named.log("log message");
	
	ok(this.calls.length === 1);
	strictEqual(this.calls[0].context.level, Logger.INFO, "Logger.log message routed at INFO level");
});

test("Logger.setLevel - Modify log filter level of all named loggers", function () { 
    var logger = this.logger;
    var named = logger.get("NamedA");
    
    // No no log messages will be routed through this logger.
    named.setLevel(logger.OFF);
    
    // Switch the global log level to DEBUG, should affect all named loggers
    logger.setLevel(logger.DEBUG);
    
    named.debug("debug message");
    
    ok(this.calls.length === 1, "Logger.setLevel() sets log filter level for all named loggers");
});