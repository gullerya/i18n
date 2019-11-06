import * as DataTier from './data-tier/data-tier.min.js';
import { Observable } from './data-tier/object-observer.min.js';

const
	locales = [
		{
			id: 'ar',
			dir: 'rtl',
			order: 2,
			label: 'عربى',
			enforce: false
		},
		{
			id: 'en',
			dir: 'ltr',
			order: 3,
			label: 'English',
			enforce: true
		},
		{
			id: 'he',
			dir: 'rtl',
			order: 1,
			label: 'עברית',
			enforce: true
		},
		{
			id: 'ru',
			dir: 'ltr',
			order: 4,
			label: 'Русский',
			enforce: false
		}
	],
	l10nCurrentModel = DataTier.ties.create('l10n', {}).model,
	resourcesMetadata = {};

const currentLocale = Observable.from({});

export {
	locales,
	currentLocale,
	setActiveLocale,
	initL10nResource,
	getL10n,
	stringifyDateTime,
	roundNumber,
	joinTexts
}

setActiveLocale('en');

function setActiveLocale(locale) {
	if (!locale) throw new Error('invalid locale "' + locale + '"');

	const newLocale = typeof locale === 'object'
		? locales.find(l => l === locale)
		: locales.find(l => l.id === locale);

	if (!newLocale) {
		throw new Error('failed to match "' + locale + '" to any of known locales');
	}

	if (currentLocale.id !== newLocale.id) {
		//	set current locale
		Object.assign(currentLocale, newLocale);

		//	apply global styling
		document.documentElement.lang = currentLocale.id;
		document.body.dir = currentLocale.dir;

		//	apply l10n configuration to any registered component
		Object.keys(resourcesMetadata).forEach(applyL10n);
	}
}

function initL10nResource(resourceId, resource) {
	//	basic resource ID validation
	if (!resourceId || typeof resourceId !== 'string') {
		throw new Error('resource Id MUST be a non-empty string');
	}
	if (Object.prototype.hasOwnProperty.call(resourcesMetadata, resourceId)) {
		throw new Error('l10n resource under ID "' + resourceId + '" has already been registered');
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
			if (locale.enforce && !(locale.id in resource)) {
				throw new Error('resource "' + resourceId + '" missing ENTRY for the required locale "' + locale.id + '"');
			}
			if (locale.enforce && !resource[locale.id]) {
				throw new Error('resource "' + resourceId + '" has INVALID ENTRY for the required locale "' + locale.id + '"');
			}
		});

	resourcesMetadata[resourceId] = resource;

	applyL10n(resourceId);
}

async function getL10n(resourceId) {
	const
		clId = currentLocale.id,
		resourceMetadata = resourcesMetadata[resourceId];
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
				console.error('failed to fetch l10n for locale "' + clId + '", resource "' + resourceId + '" by path "' + resourceMetadata[clId] + '"');
				return null;
			}
		} else {
			throw new Error('no data found for locale "' + clId + '", resource "' + resourceId + '"');
		}
	} else {
		throw new Error('l10n data was not registered for "' + resourceId + '"');
	}
}

async function applyL10n(resourceId) {
	try {
		l10nCurrentModel[resourceId] = await getL10n(resourceId);
	} catch (e) {
		console.error('failed to apply l10n change for "' + resourceId + '"', e);
	}
}

function stringifyDateTime(dateTime, pattern) {
	if (!dateTime || !(dateTime instanceof Date)) {
		throw new Error('illagal date/time parameter provided ' + dateTime);
	}

	if (!pattern || pattern === 'dd/mm/yyyy') {
		return dateTime.getDate().toString().padStart(2, '0') +
			'/' +
			(dateTime.getMonth() + 1).toString().padStart(2, '0') +
			'/' +
			dateTime.getFullYear();
	} else {
		return null;
	}
}

function roundNumber(value, decimalDigits) {
	const n = typeof value === 'string'
		? parseFloat(value)
		: value;

	if (typeof n !== 'number' || isNaN(n)) {
		console.error('invalid argument "' + value + '", returning is as is');
		return value;
	}

	if (typeof decimalDigits === 'number') {
		const multiplier = Math.pow(10, decimalDigits);
		return Math.round(n * multiplier) / multiplier;
	} else {
		return n;
	}
}

function joinTexts(texts) {
	switch (currentLocale.id) {
		case 'en': return texts.join(' and ');
		case 'he': return texts.join(' ו');
		default: return texts.join(', ');
	}
}