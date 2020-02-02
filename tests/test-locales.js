import { getSuite } from '../node_modules/just-test/dist/just-test.min.js'
import * as i18n from '../dist/i18n.js?locales';

const
	suite = getSuite({ name: 'Testing i18n - locales' }),
	ns = 'localesTest';

i18n.setNamespace(ns);

suite.runTest({ name: 'non-existing locale - negative', sync: true, expectError: 'unmatchable to any of known locales' }, async test => {
	return i18n.setActiveLocale('non-existing');
});

suite.runTest({ name: 'first pack then locale', sync: true }, async test => {
	const
		packKey = test.getRandom(8),
		enPack = { menu: { itemA: 'Option A', itemB: 'Option B' } },
		wwPack = { menu: { itemA: 'WWWWWW A', itemB: 'WWWWWW B' } };

	i18n.definePack(packKey, {
		en: enPack,
		ww: () => wwPack
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
	test.assertEqual(enPack.menu.itemA, divA.textContent);
	test.assertEqual(enPack.menu.itemB, divB.textContent);

	i18n.addLocale('ww', 'ltr', 'ww', 'WW');

	setPromise = i18n.setActiveLocale('ww');
	test.assertEqual('ww', i18n.getActiveLocale().key);
	await setPromise;
	test.assertEqual(wwPack.menu.itemA, divA.textContent);
	test.assertEqual(wwPack.menu.itemB, divB.textContent);
});

suite.runTest({ name: 'first locale then pack', sync: true }, async test => {
	i18n.addLocale('xx', 'ltr', 'xx', 'XX');

	const
		packKey = test.getRandom(8),
		enPack = { menu: { itemA: 'Option A', itemB: 'Option B' } },
		xxPack = { menu: { itemA: 'XXXXXX A', itemB: 'XXXXXX B' } };

	i18n.definePack(packKey, {
		en: enPack,
		xx: () => xxPack
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
	test.assertEqual(enPack.menu.itemA, divA.textContent);
	test.assertEqual(enPack.menu.itemB, divB.textContent);

	setPromise = i18n.setActiveLocale('xx');
	test.assertEqual('xx', i18n.getActiveLocale().key);
	await setPromise;
	test.assertEqual(xxPack.menu.itemA, divA.textContent);
	test.assertEqual(xxPack.menu.itemB, divB.textContent);
});
