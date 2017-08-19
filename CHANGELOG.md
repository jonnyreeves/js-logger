## 1.4.1 (19th August, 2017)
	- Fixed `Logger.getLevel()` Typescript definition error (#57, @timaebi)

## 1.4.0 (18th August, 2017)
	- Add `Logger.getLevel()` (#49, @BenjaminVadant)
	- Invoke `console.debug` if present (#34, @ajwagner777) 
	- Add Typing for `Logger.createDefaultHandler()` (#55, @scevallos)
	- Fix typo in README (#43, @gamtiq)
	- Update README to reference rawgit.com (#33, @tjenkinson)

## 1.3.0 (5th July, 2016)
	- Add `Logger.createDefaultHandler()`, fixes #26
	- Correct typo in README, fixes #28
	- Adds Typescript definitions (`logger.d.ts`), (#27, @pjsb)

## 1.2.0 (10 September, 2015)
	- Support for custom message formatter in Logger.useDefaults()
	- Logger.useDefaults() now expects a hash instead of a logLevel.

## 1.1.1 (14th July, 2015)
	- Fixed botched npm release of 1.1.0 :)

## 1.1.0 (14th July, 2015)
	- Prevent stringification of objects (#17, @paulinthought)

## 1.0.0 (18th April, 2015)
	- Introduce timing operations (#time and #timeEnd)
	- Update gulp dependencies.

## 0.9.14 (4th September, 2014)
	- Fix for IE7 (#10, @james-west)

## 0.9.12 (13th July, 2014)
	- Fixed `release` task to correctly push tags to origin.

## 0.9.11 (11th July, 2014)
	- Twiddling with the build and packaging process.
	- Added npm test script (`npm test`).

## 0.9.8 (11th July, 2014)

Bugfixes:
	- Added missing minified file.

## 0.9.7 (11th July, 2014)

Bugfixes:
	- Bower version updated.
	- Whitespace issue (spaces instead of tabs).
	- Dropped the notion of a `dist` folder, just giving in and checking the versioned release files into
		source control as it strikes me that's the "bower way"(tm).

## 0.9.6 (20th May, 2014)

Bugfixes:
	- `Logger.useDefaults()` now supports IE8+ (#4, @AdrianTP)

## 0.9.5 (19th May, 2014)

Bugfixes:
	- Support for NodeJS environment (#9, @fatso83)
