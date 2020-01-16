[![GitHub](https://img.shields.io/github/license/gullerya/i18n.svg)](https://github.com/gullerya/i18n)
[![npm](https://img.shields.io/npm/v/@gullerya/i18n.svg?label=npm%20@gullerya/i18n)](https://www.npmjs.com/package/@gullerya/i18n)
[![Travis](https://travis-ci.org/gullerya/i18n.svg?branch=master)](https://travis-ci.org/gullerya/i18n)
[![Codecov](https://img.shields.io/codecov/c/github/gullerya/i18n/master.svg)](https://codecov.io/gh/gullerya/i18n/branch/master)
[![Codacy](https://img.shields.io/codacy/grade/2b0fe66aa5344be9aebab713b0a07f24.svg?logo=codacy)](https://www.codacy.com/app/gullerya/i18n)

# Summary

__`i18n`__ is a client (browser) oriented library providing an easy means to quickly internationalize web sites.
As of now the library takes care of __translation__ aspect only. Other kinds of formatting / symboling needs might be considered as per future needs.
`i18n` is capable of handling complex web-component based sites with the same easiness as a simple 'flat' ones.

Main aspects:
* `i18n` library implemented as a classic service from consumer perspective - import it and use the JS APIs and correlated HTML syntax
* `i18n` library is component-design oriented: each component can and should take care of its own needs
    > Sharing of resources is super easy, to be sure. But me myself almost always consider it to be a best practice to strive to a self contained, isolated, independent components, even if in this case it means sacrificing some network and memory.
* data binding part is powered by [`data-tier`](https://www.npmjs.com/package/data-tier) engine
* the whole work performed client side, localization data may be provided in inline fashion or fetched as static resources requested from the backend
    * JSON resource format supported

#### Support matrix: ![CHROME](docs/browser_icons/chrome.png)<sub>61+</sub> | ![FIREFOX](docs/browser_icons/firefox.png)<sub>60+</sub> | ![EDGE](docs/browser_icons/edge.png)<sub>16+</sub>

#### Last versions (full changelog is [here](docs/changelog.md))

* __0.1.1__
  * Next take - mostly finalized APIs

* __0.0.1__
  * Initial implementation

# API
Refer to this [documentation](docs/api.md).

# Usage

Generally, it is highly advised to read some of the [`data-tier`](https://www.npmjs.com/package/data-tier) documentation. Being an underlying engine, it has everything needed to understand usage and internals of `i18n`.

Import the library as in example below:
```javascript
import * as i18n from './dist/i18n.min.js';
```

Define your language data per component as following:
```javascript
i18n.definePack(packKey, {
		en: { ...},                     //  inlining data
		he: '/i18n/about-he.json',      //  fetched resource
		ru: () => { ... }               //  function returning data
	}, options);
```

Parameters description (`sources` stands for the second parameter):
* `packKey` - unique key per component/pack, required
* `sources` - sources of localized texts, required
    * `JSON`, keys of which considered to be a locale keys
    * properties values may be either 
* `options` - reserved, optional

> Under component I mean any level of segregation up to consumers arbitrary choice. One may define such a pack for each and every micro part in UI, other may throw together all of the language data for the whole site.

> Pro tip: it really makes sense to split/pack i18n data according to the components visibility, so that 'About' page texts, for example, won't be dealt with until actually navigated to.

Use the following syntax in your `HTML` resources:
```html
<span data-tie="i18n:packKey.path.to.text"></span>
```
Let's break that attribute to the parts to get is clear:
* `i18n` - is the default tying namespace, you can change it via `setNamespace` API; the namespace is __global__ for the whole application
* `packKey` - first token in the path to the localized text is the component / pack key, used when the internatiolization resources was defined
* `path.to.text` - rest of the path is just a path within the localization data graph