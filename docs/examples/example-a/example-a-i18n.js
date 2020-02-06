import * as i18n from '../../../dist/i18n.js';

i18n.addLocale('fr', 'ltr', 'fr', 'Française');

customElements.define('l10n-select', class extends HTMLElement {
	connectedCallback() {
		this.innerHTML = '<select class="native-select"></select>';
		i18n.events.addEventListener(i18n.LOCALE_SET_EVENT, event => {
			this.firstElementChild.value = event.detail.current.key;
		});
		this.firstElementChild.addEventListener('change', event => {
			i18n.setActiveLocale(event.target.value);
		});
	}

	updateLocales(locales) {
		this.firstElementChild.innerHTML = '';
		if (locales && locales.length) {
			let newOptionsContent = '';
			//	copying the observed input to prevent infinite loop on its mutation
			locales
				.slice(0)
				.sort((l1, l2) => l1.lang > l2 ? 1 : -1)
				.forEach(l => newOptionsContent += `<option value="${l.key}"><span style="margin: 8px">${l.label}</span></option>`);
			this.firstElementChild.innerHTML = newOptionsContent;
		}
	}
});