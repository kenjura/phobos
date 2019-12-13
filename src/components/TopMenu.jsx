import React from 'react';

import { isAuthenticated } from '/model/services/dropbox.js';
import { Link } from 'react-router-dom';

export default class TopMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: '',
    }
  }

  render() {
    const { menu } = this.state;

    return <nav id="nav-main">
      <li>
        <Link to="/">Home</Link>
        <Link to="/campaigns/TOS">Example Article</Link>
      </li>
    </nav>
  }


}

