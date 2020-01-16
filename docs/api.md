# API

Below is the list of the exports of `i18n` library:
* [`definePack(packKey, sources, options)`](#definepack)
* `setActiveLocale(locale)`
* `getActiveLocale()`
* `events`
* `setNamespace(namespace)`

## <a id="definepack">`definePack(packKey, sources, options)`</a> 

Defines/registers localization data (translations) for the specified component (pack).

Parameters:
* `packKey` - string, unique key per component/pack, __required__
* `sources` - object, sources of localized texts, __required__
    * keys considered to be a locale keys
    * values may be either of type `object`, `string` or `function`
		* `object` - taken as localization data graph
		* `string` - taken as a URL to the localization resource; it will be fetched only upon first usage (and than cached); it expects for a `JSON` response which is localization data graph
		* `function` - parameterless function, expected to return localization data graph; may be `sync` or `async`
* `options` - object, reserved, __optional__

> Although unlikely, mentioned methods of different localization data provisioning may be used in any mixture of the consumer's choice, as in the example below.

Example:
```javascript
i18n.definePack(packKey, {
		en: { ...},                     //  inlining data
		he: '/i18n/about-he.json',      //  fetched resource
		ru: () => { ... }               //  function returning data
	}, options);
```