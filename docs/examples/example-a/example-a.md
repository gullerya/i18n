# Example A

The fully working example's app is found in this folder.
You are welcome to open the [`example-a.htm`](example-a.htm) in the browser and hack around it.

In this example we see the i18n ready items as a main menu items.
In addition, to make thing interesting and actually working, we have a custom selector that is tied to the model of the locales and performs an actual locale switch.

Pay attention, how selecting an Arabic locale falls back to the English pack - this is what happens when some locale is not provided with the l10n data in i18n pack definition.

This part may taken as a prototype to design your own locale selector, just customize the presentation and you have it.

Let's walk briefly through the parts here:
* obviously, the `htm` file to glue all the stuff together
* `example-a-app.js` simulates the main `js`, entry point and in our case does nothing but to `import` 2 other scripts
* `example-a-main-menu.js` exemplifies definition of the i18n pack
* `example-a-i18n.js` has 2 interesting points: it adds another locale to the OOTB locales list and defines the locale selector logic - bonus

First, in the `HTML` we have the following:
```html
<div class="main-menu">
	<span class="item" data-tie="i18n:mainMenu.welcome"></span>
	<span class="item" data-tie="i18n:mainMenu.settings"></span>
	<span class="item" data-tie="i18n:mainMenu.about"></span>
	<span class="item" data-tie="i18n:mainMenu.help"></span>
</div>
<l10n-select class="l10n-selector" data-tie="updateLocales(i18nLocales)"></l10n-select>
```

Main manu items, instead of having the actual texting, use a `data-tie` attribute pointing to the relevant `i18n` path.
We'll be seeing the `JS` declaration of this shortly, but let's notice the following parts:
* `i18n` - the while namespace of the i18n model (see more about data tying by `data-tier` framework and its APIs [here](https://www.npmjs.com/package/data-tier))
* `mainMenu` - this is our particular component's i18n pack key
* `welcome`, `settings` etc - rest of the path is just it - path to the actual l10n value; path may be of any depth

For the selector binding, again, look at the `data-tier` [documentation](https://www.npmjs.com/package/data-tier).

In the `example-a-main-menu.js` we see an example of i18n pack definition.
It is a pretty straight forward use of i18n API as it is documented [here](../../api.md).
I'll only mention, that in this case, due to a very small set of i18n items, i've used __inline__ fashion of API, all the l10n data found just in the script.
In the API there are other flavors described, fetched resources and functional resolvers.

`example-a-i18n.js` exepmplifies 2 things.
First, it adds another locale to the list of the i18n locales.
> Attention! As new locales may be added to the OOTB list, also the existing locales MAY be ignored, all app to your app need. It is perfectly fine to not provide l10n data for a non-relevant locales during pack definitions and also elliminate those locales from the locale selector view - all up to the consuming application and deadly easy.

Second, there is an `l10n-select` component definition with the whole lifecycle login implementation:
* populating the options of all the relevant locales
* watching for a locale activation to refect it as a current selector value (in case locale was switched by some other logic, for example user settings retrieved from the DB)
* watching for the selector value change to actually perform locale activation by the selector
> I may consider to add such a component as part of the framework, so that it would be available to any consumet OOTB.