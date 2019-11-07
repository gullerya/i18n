import { createSuite } from '../node_modules/just-test/dist/just-test.min.js'
import * as i18n from '../dist/i18n.js';

const suite = createSuite({ name: 'Testing i18n - fetched l10n resources' });

suite.runTest('fetched - full flow', async test => {
	await i18n.initL10nPack('testFetchedA', {
		en: 'l10nResources/component-a-en.json',
		he: 'l10nResources/component-a-he.json'
	});

	const
		divA = document.createElement('div'),
		divB = document.createElement('div');
	divA.dataset.tie = 'l10n:testFetchedA.menu.itemA';
	divB.dataset.tie = 'l10n:testFetchedA.menu.itemB';
	document.body.appendChild(divA);
	document.body.appendChild(divB);

	i18n.setActiveLocale('en');

	await test.waitNextMicrotask();
	test.assertEqual(divA.textContent, 'Item A');
	test.assertEqual(divB.textContent, 'Item B');

	i18n.setActiveLocale('he');

	await test.waitNextMicrotask();
	test.assertEqual(divA.textContent, 'פריט א');
	test.assertEqual(divB.textContent, 'פריט ב');
});
