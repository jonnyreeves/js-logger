(function () {
	"use strict";

	QUnit.module("js-logger", {
		beforeEach: function () {
			var calls = [];

			this.calls = calls;
			this.logger = window.Logger;

			this.logger.setHandler(function (messages, context) {
				calls.push({ messages: messages, context: context });
			});
		}
	});

	QUnit.test("Global Logger - Log messages routed to logger function", function (assert) {
		var logger = this.logger;

		// Enable all log messages.
		logger.setLevel(logger.DEBUG);

		// Route some messages through to the logFunc.
		logger.debug("A debug message");
		logger.info("An info message");
		logger.warn("A warning message");
		logger.error("An error message");

		// Check they were received.
		assert.equal(this.calls[0].messages[0], "A debug message");
		assert.strictEqual(this.calls[0].context.level, logger.DEBUG);

		assert.equal(this.calls[1].messages[0], "An info message");
		assert.strictEqual(this.calls[1].context.level, logger.INFO);

		assert.equal(this.calls[2].messages[0], "A warning message");
		assert.strictEqual(this.calls[2].context.level, logger.WARN);

		assert.equal(this.calls[3].messages[0], "An error message");
		assert.strictEqual(this.calls[3].context.level, logger.ERROR);
	});

	QUnit.test("Global Logger.enabledFor", function (assert) {
		var logger = this.logger;

		logger.setLevel(logger.OFF);
		assert.equal(logger.enabledFor(logger.DEBUG), false);
		assert.equal(logger.enabledFor(logger.INFO), false);
		assert.equal(logger.enabledFor(logger.WARN), false);
		assert.equal(logger.enabledFor(logger.ERROR), false);

		logger.setLevel(logger.DEBUG);
		assert.equal(logger.enabledFor(logger.DEBUG), true);
		assert.equal(logger.enabledFor(logger.INFO), true);
		assert.equal(logger.enabledFor(logger.WARN), true);
		assert.equal(logger.enabledFor(logger.ERROR), true);

		logger.setLevel(logger.INFO);
		assert.equal(logger.enabledFor(logger.DEBUG), false);
		assert.equal(logger.enabledFor(logger.INFO), true);
		assert.equal(logger.enabledFor(logger.WARN), true);
		assert.equal(logger.enabledFor(logger.ERROR), true);

		logger.setLevel(logger.WARN);
		assert.equal(logger.enabledFor(logger.DEBUG), false);
		assert.equal(logger.enabledFor(logger.INFO), false);
		assert.equal(logger.enabledFor(logger.WARN), true);
		assert.equal(logger.enabledFor(logger.ERROR), true);

		logger.setLevel(logger.ERROR);
		assert.equal(logger.enabledFor(logger.DEBUG), false);
		assert.equal(logger.enabledFor(logger.INFO), false);
		assert.equal(logger.enabledFor(logger.WARN), false);
		assert.equal(logger.enabledFor(logger.ERROR), true);
	});

	QUnit.test("Named logger messages not routed to global logger", function (assert) {
		var logger = this.logger;
		var namedLogger = this.logger.get("getLogger");

		logger.setLevel(Logger.DEBUG);
		namedLogger.setLevel(Logger.DEBUG);

		namedLogger.info("Message via get logger");

		assert.ok(this.calls.length === 1, "Log message was only routed via named logger.");
	});

	QUnit.test("Named logger, same instance returned", function (assert) {
		assert.strictEqual(this.logger.get("myLogger"), this.logger.get("myLogger"), "Exact same logger instance returned");
	});

	QUnit.test("Named logger setLevel does not affect global logger", function (assert) {
		var named = this.logger.get("MyLogger");

		// Set the get logger at a lower level than the global logger.
		this.logger.setLevel(Logger.OFF);
		named.setLevel(Logger.DEBUG);

		named.debug("Debug message via nemd logger");
		this.logger.debug("Debug message via Global Logger");

		// Check the log message was routed correctly.
		assert.ok(this.calls.length === 1, "LoggerFunc was invoked once");
		assert.equal(this.calls[0].context.name, "MyLogger");
	});

	QUnit.test("Logger.log convenience method", function (assert) {
		this.logger.setLevel(Logger.INFO);
		this.logger.log("log message");

		assert.ok(this.calls.length === 1);
		assert.strictEqual(this.calls[0].context.level, Logger.INFO, "Logger.log message routed at INFO level");
	});

	QUnit.test("Named logger.log convenience method", function (assert) {
		var named = this.logger.get("logHelper");
		named.setLevel(Logger.INFO);
		named.log("log message");

		assert.ok(this.calls.length === 1);
		assert.strictEqual(this.calls[0].context.level, Logger.INFO, "Logger.log message routed at INFO level");
	});

	QUnit.test("Logger.setLevel - Modify log filter level of all named loggers", function (assert) {
		var logger = this.logger;
		var named = logger.get("NamedA");

		// No no log messages will be routed through this logger.
		named.setLevel(logger.OFF);

		// Switch the global log level to DEBUG, should affect all named loggers
		logger.setLevel(logger.DEBUG);

		named.debug("debug message");

		assert.ok(this.calls.length === 1, "Logger.setLevel() sets log filter level for all named loggers");
	});

	QUnit.test("Logger.useDefaults logs to console", function (assert) {
		var logger = this.logger;

		var sandbox = sinon.sandbox.create();
		sandbox.stub(console, "log");
		sandbox.stub(console, "info");
		sandbox.stub(console, "warn");
		sandbox.stub(console, "error");

		logger.useDefaults();
		logger.debug("debug message");
		logger.info("info message");
		logger.warn("warning message");
		logger.error("error message");

		assert.ok(console.log.calledOnce, "logger.debug calls console.log");
		assert.ok(console.info.calledOnce, "logger.info calls console.info");
		assert.ok(console.warn.calledOnce, "logger.warn calls console.warn");
		assert.ok(console.error.calledOnce, "logger.error calls console.error");

		sandbox.restore();
	});
}());