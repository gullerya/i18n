import { getSuite } from '../node_modules/just-test/dist/just-test.min.js'
import * as i18n from '../dist/i18n.js?ns=fetched';

const
	suite = getSuite({ name: 'Testing i18n - fetched resources' }),
	ns = 'i18nFetched';

i18n.setNamespace(ns);

suite.runTest({ name: 'fetched - full flow', sync: true }, async test => {
	const packKey = test.getRandom(8);
	await i18n.definePack(packKey, {
		en: 'i18nPacks/component-a-en.json',
		he: 'i18nPacks/component-a-he.json'
	});

	const
		divA = document.createElement('div'),
		divB = document.createElement('div');
	divA.dataset.tie = `${ns}:${packKey}.menu.itemA`;
	divB.dataset.tie = `${ns}:${packKey}.menu.itemB`;
	document.body.appendChild(divA);
	document.body.appendChild(divB);

	let setPromise = i18n.setActiveLocale('en');
	test.assertEqual('en', i18n.getActiveLocale().key);
	await setPromise;
	test.assertEqual('Item A', divA.textContent);
	test.assertEqual('Item B', divB.textContent);

	setPromise = i18n.setActiveLocale('he');
	test.assertEqual('he', i18n.getActiveLocale().key);
	await setPromise;
	test.assertEqual('פריט א', divA.textContent);
	test.assertEqual('פריט ב', divB.textContent);
});