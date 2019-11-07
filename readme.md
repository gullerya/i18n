[![GitHub](https://img.shields.io/github/license/gullerya/i18n.svg)](https://github.com/gullerya/i18n)
[![npm](https://img.shields.io/npm/v/@gullerya/i18n.svg?label=npm%20@gullerya/i18n)](https://www.npmjs.com/package/@gullerya/i18n)
[![Travis](https://travis-ci.org/gullerya/i18n.svg?branch=master)](https://travis-ci.org/gullerya/i18n)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/i18n/master.svg)](https://codecov.io/gh/gullerya/i18n/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/2b0fe66aa5344be9aebab713b0a07f24.svg?logo=codacy)](https://www.codacy.com/app/gullerya/i18n)

# Summary

__`i18n`__ is a client (browser) oriented library providing an easy means to quickly localize web sites; `i18n` is capable of handling complex web-component based sites with the same easiness as a simple 'flat' ones.

Main aspects:
* this `i18n` library implemented as a classic service from consumer perspective - import it and use the JS APIs and correlated HTML syntax
* `i18n` library is component-design oriented: each component can and should take care of its own needs
    > Sharing or resources is super easy, to be sure, but me myself almost always consider it to be a best practice to strive to self contained, isolated, independent components, even if in this case it means sacrificing some network and memory
* data binding part is powered by [`data-tier`](https://www.npmjs.com/package/data-tier) engine
* the whole work performed client side, localization data may be provided in inline fashion or fetched as static resources requested from the backend
    * JSON resource format supported

#### Support matrix: ![CHROME](docs/browser_icons/chrome.png)<sub>61+</sub> | ![FIREFOX](docs/browser_icons/firefox.png)<sub>60+</sub> | ![EDGE](docs/browser_icons/edge.png)<sub>16+</sub>

#### Last versions (full changelog is [here](docs/changelog.md))

* __0.0.1__
  * Initial implementation

# API
`i18n` library consists of a ...

#### import:
Import the library as in example below:
```javascript
import { ... } from './dist/i18n.min.js';
```

# Typical usage example
The flow below exemplifies typical usage of the library:
```javascript
```
