# APIs

Below is the list of the exports of `i18n` library:
* [`Locale`](#locale)
* [`definePack(packKey, sources, options)`](#define-pack)
* [`events`](#events)
* [`getActiveLocale()`](#get-active)
* [`setActiveLocale(locale)`](#set-active)
* [`setNamespace(namespace)`](#set-ns)

## <a id="locale">`Locale`</a>

A class defining a `Locale` objects.

## <a id="define-pack">`definePack(packKey, sources, options)`</a>

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

## <a id="events">`events`</a>

Events is actually an `EventTarget` instance, used by `i18n` library to dispatch event notifications. Thus rules and syntax of subscribing / unsubscribing is standard, see [this](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) documentation for details.

Available events:
* __`localeSet`__ - raised immediatelly, synchronously, after setting the active locale to the new value
	* consider it as 'localization start' event; might be useful for veiling the app for a moment, or visualizing the new locale selection
	* `detail` of the event will hold the `current` (new) and the `previous` locales
* __`localeApplied`__ - raised after all of the localization resources has been verified, fetched if needed and set on the binding scope
	* some of the actual DOM updates MAY still be in progress, but it is already safe to run 'post localization' stuff here
	* `detail` of the event will hold the `current` (new) and the `previous` locales

## <a id="get-active">`getActiveLocale()`</a>

Returns the currently active locale.

## <a id="set-active">`setActiveLocale(locale)`</a>

Activates the specified locale, initiates localization process of the components as per new language selection.

## <a id="set-ns">`setNamespace(namespace)`</a>

Part of the binding syntax used in `HTML` is the __namespace__, the string which starts the value of the `data-tie` attribute (or `<element>.dataset.tie`, if `JS` approach is used).

Default namespace is `i18n`. `setNamespace` API allows to change it to any other token, as far as it fulfills the requirements of a valid __tie key__ (see [this](https://github.com/gullerya/data-tier/blob/HEAD/docs/api-reference.md#a-const-tiedmodel--datatiertiescreatekey-model) for details).

__Important!__ Whether the default namespace is used or a custom one - the namespace is __global__ and should be __consistent__ accross the application! If application components will change the namespace back and forth to different values - only the last set value will have the effect, rest of them won't react on further language changes.