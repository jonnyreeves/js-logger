## 1.6.1
	- Released 12th November, 2020
	- Add `setDefaults` alias for `useAlias` (#103, @harrisrobin)

## 1.6.0
	- Released 23rd October, 2017
	- Fix broken TypeScript definitions introduced in 1.5.0, fixes #85
	- Add `Logger.trace()` method to TypeScript definitions, fixes #86
	- Export all interfaces in TypeScript definitions

## 1.5.0 
	- Released 13th October, 2017
	- Added `Logger.trace()` (#67, @ddanila)
	- Fix TypeScript definitions for ILoggerOpts (#70, @timm-gs)
	- Export ILogger interface in TypeScript definitions (#82, @tanneess)

## 1.4.1 
	- Released 19th August, 2017
	- Fixed `Logger.getLevel()` Typescript definition error (#57, @timaebi)

## 1.4.0 
	- Released 18th August, 2017
	- Add `Logger.getLevel()` (#49, @BenjaminVadant)
	- Invoke `console.debug` if present (#34, @ajwagner777) 
	- Add Typing for `Logger.createDefaultHandler()` (#55, @scevallos)
	- Fix typo in README (#43, @gamtiq)
	- Update README to reference rawgit.com (#33, @tjenkinson)

## 1.3.0 
	- Released 5th July, 2016
	- Add `Logger.createDefaultHandler()`, fixes #26
	- Correct typo in README, fixes #28
	- Adds Typescript definitions (`logger.d.ts`), (#27, @pjsb)

## 1.2.0 
	- Released 10 September, 2015
	- Support for custom message formatter in Logger.useDefaults()
	- Logger.useDefaults() now expects a hash instead of a logLevel.

## 1.1.1 
	- Released 14th July, 2015
	- Fixed botched npm release of 1.1.0 :)

## 1.1.0 
	- Released 14th July, 2015
	- Prevent stringification of objects (#17, @paulinthought)

## 1.0.0 
	- Released 18th April, 2015
	- Introduce timing operations (#time and #timeEnd)
	- Update gulp dependencies.

## 0.9.14 
	- Released 4th September, 2014
	- Fix for IE7 (#10, @james-west)

## 0.9.12 
	- Released 13th July, 2014
	- Fixed `release` task to correctly push tags to origin.

## 0.9.11 
	- Released 11th July, 2014
	- Twiddling with the build and packaging process.
	- Added npm test script (`npm test`).

## 0.9.8 
	- Released 11th July, 2014
	- Added missing minified file.

## 0.9.7 
	- Released 11th July, 2014
	- Bower version updated.
	- Whitespace issue (spaces instead of tabs).
	- Dropped the notion of a `dist` folder, just giving in and checking the versioned release files into
		source control as it strikes me that's the "bower way"(tm).

## 0.9.6 
	- Released 20th May, 2014
	- `Logger.useDefaults()` now supports IE8+ (#4, @AdrianTP)

## 0.9.5 
	- Released 19th May, 2014
	- Support for NodeJS environment (#9, @fatso83)
