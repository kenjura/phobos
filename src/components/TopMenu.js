import { getFileContents, isAuthenticated } from '/model/dropbox.js';

export default class TopMenu extends HTMLElement {

  onBeforeEnter(location, commands) {
    // if (!isAuthenticated()) {
    //   localStorage.setItem('returnUrl', window.location.href);
    //   return commands.redirect('/login/');
    // }
  }

  connectedCallback() {
    this.innerHTML = `<nav id="top-menu">
    <!-- <li>
      <a id="authlink">login to dropbox</a>
    </li>
    <li>
      <a onclick="checkUser()">check user</a>
    </li>
    <li>
      <a onclick="getFiles()">get files</a>
    </li> -->
    <li>Top menu!</li>
    <li><a href="/">Home</a></li>
    <li><a href="/campaigns/index.md">Example Article</a></li>
    <li><a href="/blarb">Unknown</a></li>
  </nav>`;
  }
}

customElements.define('top-menu', TopMenu);