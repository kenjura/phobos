import { getLogin, ingestAccessToken } from '/model/dropbox.js';
import { Router } from 'https://unpkg.com/@vaadin/router';

export default class LoginView extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
  	const { returnUrl } = this.location.params;
  	if (returnUrl === 'success') {
  		ingestAccessToken();
  		const url = localStorage.getItem('returnUrl');
  		Router.go(url);
  	} else {
  		getLogin({ returnUrl })
  			.then(loginUrl => this.innerHTML =  `<a href="${loginUrl}">log in to dropbox</a>`)
  			.catch(err => console.error('LoginView > ', err));
  	}
  }
}

customElements.define('login-view', LoginView);