import { createSuite } from '../node_modules/just-test/dist/just-test.min.js'
import * as i18n from '../dist/i18n.js?ns=inline';

const
	suite = createSuite({ name: 'Testing i18n - inline resources' }),
	ns = 'i18nInline';

i18n.setNamespace(ns);

suite.runTest({ name: 'inline - full flow', sync: true }, async test => {
	const
		packKey = test.getRandom(8),
		packsData = {
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
		}

	i18n.definePack(packKey, packsData);

	const
		divA = document.createElement('div'),
		divB = document.createElement('div');
	divA.dataset.tie = `${ns}:${packKey}.menu.optionA`;
	divB.dataset.tie = `${ns}:${packKey}.menu.optionB`;
	document.body.appendChild(divA);
	document.body.appendChild(divB);

	let setPromise = i18n.setActiveLocale('en');
	test.assertEqual('en', i18n.getActiveLocale().key);
	await setPromise;
	test.assertEqual(packsData.en.menu.optionA, divA.textContent);
	test.assertEqual(packsData.en.menu.optionB, divB.textContent);

	setPromise = i18n.setActiveLocale('he');
	test.assertEqual('he', i18n.getActiveLocale().key);
	await setPromise;
	test.assertEqual(packsData.he.menu.optionA, divA.textContent);
	test.assertEqual('', divB.textContent);
});
