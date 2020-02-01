import { getSuite } from '../node_modules/just-test/dist/just-test.min.js'
import * as i18n from '../dist/i18n.js?ns=functional';

const
	suite = getSuite({ name: 'Testing i18n - functional resources' }),
	ns = 'i18nFunctional';

i18n.setNamespace(ns);

suite.runTest({ name: 'functional - full flow', sync: true }, async test => {
	const
		packKey = test.getRandom(8),
		enPack = { keyA: 'Key A', keyB: 'Key B' },
		hePack = { keyA: 'מפתח א', keyB: 'מפתח ב' };

	await i18n.definePack(packKey, {
		en: () => enPack,
		he: async () => {
			await test.waitNextMicrotask();
			return hePack;
		}
	});

	const
		divA = document.createElement('div'),
		divB = document.createElement('div');
	divA.dataset.tie = `${ns}:${packKey}.keyA`;
	divB.dataset.tie = `${ns}:${packKey}.keyB`;
	document.body.appendChild(divA);
	document.body.appendChild(divB);

	let setPromise = i18n.setActiveLocale('en');
	test.assertEqual('en', i18n.getActiveLocale().key);
	await setPromise;
	test.assertEqual(enPack.keyA, divA.textContent);
	test.assertEqual(enPack.keyB, divB.textContent);

	setPromise = i18n.setActiveLocale('he');
	test.assertEqual('he', i18n.getActiveLocale().key);
	await setPromise;
	test.assertEqual(hePack.keyA, divA.textContent);
	test.assertEqual(hePack.keyB, divB.textContent);
});
