﻿import { createSuite } from '../node_modules/just-test/dist/just-test.min.js'
import * as i18n from '../dist/i18n.js';

const suite = createSuite({ name: 'Testing i18n - inline l10n resources' });

suite.runTest({ name: 'inline - full flow', sync: true }, async test => {
	const packKey = test.getRandom(8);
	i18n.initL10nPack(packKey, {
		en: {
			menu: {
				optionA: 'Option A',
				optionB: 'Option B'
			}
		},
		he: {
			menu: {
				optionA: 'אפשרות א'
			}
		}
	});

	const
		divA = document.createElement('div'),
		divB = document.createElement('div');
	divA.dataset.tie = `l10n:${packKey}.menu.optionA`;
	divB.dataset.tie = `l10n:${packKey}.menu.optionB`;
	document.body.appendChild(divA);
	document.body.appendChild(divB);

	i18n.setActiveLocale('en');

	await test.waitNextMicrotask();
	test.assertEqual(divA.textContent, 'Option A');
	test.assertEqual(divB.textContent, 'Option B');

	i18n.setActiveLocale('he');

	await test.waitNextMicrotask();
	test.assertEqual(divA.textContent, 'אפשרות א');
	test.assertEqual(divB.textContent, '');
});
