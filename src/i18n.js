import * as DataTier from './data-tier/data-tier.min.js';

const
	locales = [
		{
			id: 'ar',
			dir: 'rtl',
			lang: 'ar',
			label: 'عربى'
		},
		{
			id: 'en',
			dir: 'ltr',
			lang: 'en',
			label: 'English'
		},
		{
			id: 'he',
			dir: 'rtl',
			lang: 'he',
			label: 'עברית'
		},
		{
			id: 'ru',
			dir: 'ltr',
			lang: 'ru',
			label: 'Русский'
		}
	],
	l10nModel = DataTier.ties.create('l10n'),
	resourcesMetadata = {};

let currentLocale;

export {
	locales,
	getActiveLocale,
	setActiveLocale,
	initL10nPack,
	getL10n
}

setActiveLocale('en');

function getActiveLocale() {
	return currentLocale;
}

function setActiveLocale(locale) {
	if (!locale) {
		throw new Error('invalid locale "' + locale + '"');
	}

	const newLocale = typeof locale === 'object'
		? locales.find(l => l === locale)
		: locales.find(l => l.id === locale);

	if (!newLocale) {
		throw new Error('failed to match "' + locale + '" to any of known locales');
	}

	if (!currentLocale || currentLocale.id !== newLocale.id) {
		//	set current locale
		currentLocale = newLocale;

		//	apply global styling
		document.documentElement.lang = currentLocale.id;
		document.body.dir = currentLocale.dir;

		//	apply l10n configuration to any registered component
		Object.keys(resourcesMetadata).forEach(applyL10n);
	}
}

async function initL10nPack(key, resource) {
	//	basic resource ID validation
	if (!key || typeof key !== 'string') {
		throw new Error('key MUST be a non-empty string');
	}
	if (Object.prototype.hasOwnProperty.call(resourcesMetadata, key)) {
		throw new Error('l10n resource keyed "' + key + '" has already been registered');
	}

	//	basic resource validation
	if (!resource) {
		throw new Error('invalid resource (' + resource + ')');
	}
	if (typeof resource !== 'object') {
		throw new Error('resource MUST be an object');
	}

	//	process l10n data
	locales
		.forEach(locale => {
			//	validate per locale entry
			if (locale.required && !(locale.id in resource)) {
				throw new Error('resource "' + key + '" missing ENTRY for the required locale "' + locale.id + '"');
			}
			if (locale.required && !resource[locale.id]) {
				throw new Error('resource "' + key + '" has INVALID ENTRY for the required locale "' + locale.id + '"');
			}
		});

	resourcesMetadata[key] = resource;

	await applyL10n(key);
}

async function getL10n(key) {
	const
		clId = currentLocale.id,
		resourceMetadata = resourcesMetadata[key];
	if (resourceMetadata) {
		if (typeof resourceMetadata[clId] === 'object') {
			return resourceMetadata[clId];
		} else if (typeof resourceMetadata[clId] === 'string') {
			const resource = await fetch(resourceMetadata[clId]);
			if (resource.status === 200) {
				const contents = await resource.json();
				//	caching for the future uses
				resourceMetadata[clId] = contents;
				return contents;
			} else {
				console.error('failed to fetch l10n for locale "' + clId + '", resource "' + key + '" by path "' + resourceMetadata[clId] + '"');
				return null;
			}
		} else {
			throw new Error('no data found for locale "' + clId + '", resource "' + key + '"');
		}
	} else {
		throw new Error('l10n data was not registered for "' + key + '"');
	}
}

async function applyL10n(resourceId) {
	try {
		l10nModel[resourceId] = await getL10n(resourceId);
	} catch (e) {
		console.error('failed to apply l10n change for "' + resourceId + '"', e);
	}
}