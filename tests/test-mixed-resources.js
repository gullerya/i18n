import { createSuite } from '../node_modules/just-test/dist/just-test.min.js'
import * as i18n from '../dist/i18n.js';

const suite = createSuite({ name: 'Testing i18n - mixed l10n resources' });

suite.runTest('mixed - full flow', async test => {
	await i18n.initL10nPack('testMixedA', {
		en: {
			menu: {
				optionA: 'Option A',
				optionB: 'Option B'
			}
		},
		he: 'l10nResources/component-a-he.json'
	});

	const
		divA = document.createElement('div'),
		divB = document.createElement('div');
	divA.dataset.tie = 'l10n:testMixedA.menu.itemA';
	divB.dataset.tie = 'l10n:testMixedA.menu.itemB';
	document.body.appendChild(divA);
	document.body.appendChild(divB);

	i18n.setActiveLocale('en');

	await test.waitNextMicrotask();
	if (i18n.getActiveLocale.id === 'en') {
		test.assertEqual(divA.textContent, 'Item A');
		test.assertEqual(divB.textContent, 'Item B');
	} else if (i18n.getActiveLocale.id === 'en') {
		test.assertEqual(divA.textContent, 'פריט א');
		test.assertEqual(divB.textContent, 'פריט ב');
	}

	i18n.setActiveLocale('he');

	await test.waitNextMicrotask();
	if (i18n.getActiveLocale.id === 'en') {
		test.assertEqual(divA.textContent, 'Item A');
		test.assertEqual(divB.textContent, 'Item B');
	} else if (i18n.getActiveLocale.id === 'en') {
		test.assertEqual(divA.textContent, 'פריט א');
		test.assertEqual(divB.textContent, 'פריט ב');
	}
});
