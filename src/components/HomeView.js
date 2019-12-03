export default class HomeView extends HTMLElement {
  constructor() {
    super();
  }

  // static get observedAttributes() {
  //   return [ 'model' ];
  // }

  // attributeChangedCallback(name, oldValue, newValue) {
  //   this.render();
  // }

  connectedCallback() {
    this.innerHTML = 'home view';
  }
}

customElements.define('home-view', HomeView);