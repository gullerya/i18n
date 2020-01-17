import * as DataTier from './data-tier/data-tier.min.js';

class Locale {
	constructor(key, dir, lang, label) {
		if (!key) throw new Error(`invalid key param "${key}"`);
		if (dir !== 'ltr' && dir !== 'rtl') throw new Error(`invalid dir param "${dir}" (only "ltr" or "rtl" allowed)`);
		if (!lang || typeof lang !== 'string') throw new Error(`invalid lang param "${lang}"`);
		if (!label || typeof label !== 'string') throw new Error(`invalid label param "${label}"`);
		this.key = key;
		this.dir = dir;
		this.lang = lang;
		this.label = label;
		Object.freeze(this);
	}
}

const
	DEFAULT_NAMESPACE = 'i18n',
	locales = [
		new Locale('ar', 'rtl', 'ar', 'عربى'),
		new Locale('en', 'ltr', 'en', 'English'),
		new Locale('he', 'rtl', 'he', 'עברית'),
		new Locale('ru', 'ltr', 'ru', 'Русский')
	],
	events = new EventTarget(),
	LOCALE_SET_EVENT = 'localeSet',
	LOCALE_APPLIED_EVENT = 'localeApplied',
	packsMetadata = {},
	DEFAULT_PACK_LOCALE = Symbol('default.pack.locale');

let namespace = DEFAULT_NAMESPACE,
	i18nData,
	currentLocale;

export {
	setNamespace,
	locales,
	definePack,
	getActiveLocale,
	setActiveLocale,
	events,
	LOCALE_SET_EVENT,
	LOCALE_APPLIED_EVENT
}

setActiveLocale('en');

function setNamespace(newNS) {
	if (!newNS || typeof newNS !== 'string') {
		throw new Error(`invalid namespace "${newNS}"`);
	}
	if (newNS === namespace) {
		return;
	}

	i18nData = DataTier.ties.create(newNS, i18nData || {});
	namespace = newNS;
}

function getActiveLocale() {
	return currentLocale;
}

async function setActiveLocale(locale) {
	if (!locale) {
		throw new Error(`invalid locale "${locale}"`);
	}

	const newLocale = typeof locale === 'object' ? locales.find(l => l === locale) : locales.find(l => l.key === locale);

	if (!newLocale) {
		throw new Error(`"${locale}" unmatchable to any of known locales`);
	}

	if (!currentLocale || currentLocale.key !== newLocale.key) {
		//	set current locale
		const eventDetails = {
			current: newLocale,
			previous: currentLocale
		};
		currentLocale = newLocale;

		//	emit localeSet event
		events.dispatchEvent(new CustomEvent(LOCALE_SET_EVENT, { detail: eventDetails }));

		//	apply global styling
		document.documentElement.lang = currentLocale.key;
		document.body.dir = currentLocale.dir;

		//	apply new locale to any registered component
		const allApplied = [];
		Object.keys(packsMetadata).forEach(packKey => allApplied.push(applyLocale(packKey)));
		await Promise.all(allApplied);

		//	emit localeApplied event
		events.dispatchEvent(new CustomEvent(LOCALE_APPLIED_EVENT, { detail: eventDetails }));
	}
}

async function definePack(key, source, options) {
	const opts = Object.assign({
		defaultLocale: 'en'
	}, options);

	//	pack key validation
	if (!key || typeof key !== 'string') {
		throw new Error(`invalid pack key "${key}"`);
	}
	if (key in packsMetadata) {
		throw new Error(`key "${key}" is already defined`);
	}

	//	source validation
	if (!source || typeof source !== 'object') {
		throw new Error(`invalid source "${source}"`);
	}
	if (!Object.keys(source).length) {
		throw new Error(`invalid source "${source}" (no locale keys found, at least one expected)`);
	}

	//	set default locale for this pack
	source[DEFAULT_PACK_LOCALE] = opts.defaultLocale in source ? opts.defaultLocale : Object.keys(source)[0];

	packsMetadata[key] = source;
	await applyLocale(key);
}

async function applyLocale(packKey) {
	const localeKey = currentLocale ? currentLocale.key : null;
	try {
		ensureI18nDataStore();
		i18nData[packKey] = localeKey ? await getI18nData(localeKey, packKey) : null;
	} catch (e) {
		console.error(`failed to apply i18n data for "${localeKey}" of "${packKey}" pack, error:`, e);
	}
}

async function getI18nData(localeKey, packKey) {
	let result = null;
	const packMeta = packsMetadata[packKey];

	if (!packMeta) {
		console.warn(`no i18n data found for "${packKey}" pack`);
	} else {
		let packLocaleData = packMeta[localeKey];
		if (!packLocaleData) {
			const defaultPackLocale = packMeta[DEFAULT_PACK_LOCALE];
			packLocaleData = packMeta[defaultPackLocale];
			console.warn(`no i18n data found for "${localeKey}" of "${packKey}" pack, fallen back to "${defaultPackLocale}"`);
		}

		if (typeof packLocaleData === 'object') {
			result = packMeta[localeKey];
		} else if (typeof packLocaleData === 'function') {
			result = await Promise.resolve(packLocaleData());
		} else if (typeof packLocaleData === 'string') {
			console.info(`fetching i18n data for "${localeKey}" of "${packKey}" pack from "${packLocaleData}"...`)
			try {
				const resource = await fetch(packMeta[localeKey]);
				if (resource.ok) {
					result = await resource.json();
					packMeta[localeKey] = result;
				} else {
					throw new Error(`unexpected status '${resource.status}`);
				}
			} catch (e) {
				console.error(`failed to fetch i18n data for "${localeKey}" of "${packKey}" from "${packLocaleData}", error:`, e);
			}
		}
	}
	return result;
}

function ensureI18nDataStore() {
	return i18nData || DataTier.ties.create(namespace);
}