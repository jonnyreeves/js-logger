# js-Logger [![Build Status](https://travis-ci.org/jonnyreeves/js-logger.svg?branch=master)](https://travis-ci.org/jonnyreeves/js-logger) [![npm version](https://badge.fury.io/js/js-logger.svg)](http://badge.fury.io/js/js-logger) ![npm dependencies](https://david-dm.org/jonnyreeves/js-logger.png)

> Lightweight, unobtrusive, configurable JavaScript logger.

[logger.js](https://github.com/jonnyreeves/js-logger/blob/master/src/logger.js) will make you rich, famous and want for almost nothing - oh and it's a flexible abstraction over using `console.log` as well.

## Installation
js-Logger has zero dependencies and comes with AMD and CommonJS module boilerplate.  If the last sentence meant nothing to you then just lob the following into your page:

```html
<script src="https://unpkg.com/js-logger/src/logger.min.js"></script>
```

Have a look at [babel-plugin-js-logger](https://github.com/core-process/babel-plugin-js-logger), in case your project utilizes [Babel](https://babeljs.io/), and you want to use js-Logger throughout your entire project efficiently.

## Usage
Nothing beats the sheer ecstasy of logging!  js-Logger does its best to not be awkward and get in the way.  If you're the sort of person who just wants to get down and dirty then all you need is one line of code:

```js
// Log messages will be written to the window's console.
Logger.useDefaults();
```

Now, when you want to emit a red-hot log message, just drop one of the following (the syntax is identical to the `console` object)

```js
Logger.debug("I'm a debug message!");
Logger.info("OMG! Check this window out!", window);
Logger.warn("Purple Alert! Purple Alert!");
Logger.error("HOLY SHI... no carrier.");
Logger.trace("Very verbose message that usually is not needed...");
Logger.trace("...containing stack trace (if console.trace() method supports it)");
```

Log messages can get a bit annoying; you don't need to tell me, it's all cool.  If things are getting too noisy for your liking then it's time you read up on the `Logger.setLevel` method:

```js
// Only log WARN and ERROR messages.
Logger.setLevel(Logger.WARN);
Logger.debug("Donut machine is out of pink ones");  // Not a peep.
Logger.warn("Asteroid detected!");  // Logs "Asteroid detected!", best do something about that!

// Ah, you know what, I'm sick of all these messages.
// But I want to see them again later
var oldLevel = Logger.getLevel();
Logger.setLevel(Logger.OFF);
Logger.error("Hull breach on decks 5 through to 41!");  // ...

// Actually, maybe those logs were quite useful...
Logger.setLevel(oldLevel);

```

## Log Handler Functions
All log messages are routed through a handler function which redirects filtered messages somewhere.  You can configure the handler function via `Logger.setHandler` noting that the supplied function expects two arguments; the first being the log messages to output and the latter being a context object which can be inspected by the log handler.

```js
Logger.setHandler(function (messages, context) {
	// Send messages to a custom logging endpoint for analysis.
	// TODO: Add some security? (nah, you worry too much! :P)
	jQuery.post('/logs', { message: messages[0], level: context.level });
});
```

### Default Log Handler Function
js-Logger provides a default handler function which writes to your browser's `console` object using the appropriate logging functions based on the message's log level (ie: `Logger.info()` will result in a call to `console.info()`).  The default handler automatically shims for sub-optiomal environments right down to IE7's complete lack of `console` object (it only appears when you open the DevTools - seriously, this is one of the anti-user troll things I've seen!)

Use `Logger.createDefaultHandler()` to return a new log handler function which can then be supplied to `Logger.setHandler()`.

You can customise the formatting of each log message by supplying a formatter function to `createDefaultHandler`:

```js
Logger.createDefaultHandler({
	formatter: function(messages, context) {
		// prefix each log message with a timestamp.
		messages.unshift(new Date().toUTCString())
	}
});
```

You can use functional composition to extend the default handler with your own custom handler logic:

```js
var consoleHandler = Logger.createDefaultHandler();
var myHandler = function (messages, context) {
	jQuery.post('/logs', { message: messages[0], level: context.level });
};

Logger.setHandler(function (messages, context) {
	consoleHandler(messages, context);
	myHandler(messages, context);
});

```

### useDefaults
`Logger.useDefaults()` is a convenience function which allows you to configure both the default logLevel and handler in one go:

```js
Logger.useDefaults({
	defaultLevel: Logger.WARN,
	formatter: function (messages, context) {
		messages.unshift(new Date().toUTCString())
	}
})
```

You can also use the alias `Logger.setDefaults()`.

## Named Loggers
Okay, let's get serious, logging is not for kids, it's for adults with serious software to write and mission critical log messages to trawl through.  To help you in your goal, js-Logger provides 'named' loggers which can be configured individual with their own contexts.

```js
// Retrieve a named logger and store it for use.
var myLogger = Logger.get('ModuleA');
myLogger.info("FizzWozz starting up");

// This logger instance can be configured independent of all others (including the global one).
myLogger.setLevel(Logger.WARN);

// As it's the same instance being returned each time, you don't have to store a reference:
Logger.get('ModuleA').warn('FizzWozz combombulated!');
```

Note that `Logger.setLevel()` will also change the current log filter level for all named logger instances; so typically you would configure your logger levels like so:

```js
// Create several named loggers (typically in their own module)
var loggerA = Logger.get('LoggerA');
var loggerB = Logger.get('LoggerB');
var loggerC = Logger.get('LoggerC');

// Configure log levels.
Logger.setLevel(Logger.WARN);  // Global logging level.
Logger.get('LoggerB').setLevel(Logger.DEBUG);  // Enable debug logging for LoggerB
Logger.get('LoggerC').setLevel(Logger.TRACE);  // Enable trace logging for LoggerC
```

## Profiling
Sometimes its good to know what's taking so damn long; you can use `Logger.time()` and `Logger.timeEnd()` to keep tabs on things, the default log handler implementation delegates to the equivalent console methods if they exist, or write to `console.log` if they don't.

```js
// Start timing something
Logger.time('self destruct sequence');

// ... Some time passes ...

// Stop timing something.
Logger.timeEnd('self destruct sequence'); // logs: 'self destruct sequence: 1022ms'.
```

Note that `time` and `timeEnd` methods are also provided to named Logger instances.

## Usage with TypeScript
TypeScript is great, you should use it. See [the typescript consumer test](./test-src/typescript-consumer/index.ts) for example usage.
