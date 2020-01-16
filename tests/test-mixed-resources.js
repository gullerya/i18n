import { createSuite } from '../node_modules/just-test/dist/just-test.min.js'
import * as i18n from '../dist/i18n.js?ns=mixed';

const
	suite = createSuite({ name: 'Testing i18n - mixed resources' }),
	ns = 'i18nMixed';

i18n.setNamespace(ns);

suite.runTest({ name: 'mixed - full flow', sync: true }, async test => {
	const
		packKey = test.getRandom(8),
		enPack = { menu: { itemA: 'Option A', itemB: 'Option B' } },
		ruPack = { menu: { itemA: 'Russian A', itemB: 'Russian B' } };

	i18n.definePack(packKey, {
		en: enPack,
		he: 'i18nPacks/component-a-he.json',
		ru: () => ruPack
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

	setPromise = i18n.setActiveLocale('he');
	test.assertEqual('he', i18n.getActiveLocale().key);
	await setPromise;
	test.assertEqual('פריט א', divA.textContent);
	test.assertEqual('פריט ב', divB.textContent);

	setPromise = i18n.setActiveLocale('ru');
	test.assertEqual('ru', i18n.getActiveLocale().key);
	await setPromise;
	test.assertEqual(ruPack.menu.itemA, divA.textContent);
	test.assertEqual(ruPack.menu.itemB, divB.textContent);
});
