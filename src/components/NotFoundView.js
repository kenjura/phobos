export default class NotFoundView extends HTMLElement {
	// We are using `route` property, which is defined by the router
	connectedCallback() {
		this.innerHTML = `
			<h1>Page not found</h1>
			The pathname was: ${this.location.pathname}
		`;
	}
}
customElements.define('not-found-view', NotFoundView);