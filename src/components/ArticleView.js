import { getFileContents, isAuthenticated } from '/model/dropbox.js';
import { markdownToHtml } from '/helpers/markdownHelper.js';

export default class ArticleView extends HTMLElement {
  constructor() {
    super();
  }

  onBeforeEnter(location, commands) {
    if (!isAuthenticated()) {
      localStorage.setItem('returnUrl', window.location.href);
      return commands.redirect('/login/');
    }
  }

  // static get observedAttributes() {
  //   return [ 'model' ];
  // }

  // attributeChangedCallback(name, oldValue, newValue) {
  //   this.render();
  // }

  connectedCallback() {
    if (!isAuthenticated()) {
      console.error('ArticleView > this should never have happened.');
      return;
    }
    const articlePath = this.location.params[0];
    this.innerHTML = this.render({ articlePath, loading:true });
    this.load();
  }

  async load() {
    const articlePath = this.location.params[0];
    const { content } = await getFileContents(articlePath);
    const body = markdownToHtml(content);
    this.innerHTML = this.render({ title:'title TBD', body, loading:false });
  }

  render(props) {
    if (props.loading) {
      return `<h1>Loading "${props.articlePath}"</h1>`;
    } else {
      return `<h1>${props.title}</h1><article>${props.body}</article>`;
    }
  }
}

customElements.define('article-view', ArticleView);