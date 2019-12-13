import React from 'react';

import { load } from '../model/services/ArticleLoader';
import { markdownToHtml } from '../helpers/markdownHelper';
import { isAuthenticated } from '/model/services/dropbox.js';
import { Link, withRouter } from 'react-router-dom';

class TopMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: '',
    }
  }

  componentDidMount() {
    this.start();
  }

  async start() {
    const { location } = this.props;
    if (!location || !location.pathname) throw new Error('Article > somehow, article path is not available. This is the end, folks.');

    const fuzzypath = location.pathname;

    const { menu } = await load({ fuzzypath });
    const body = markdownToHtml(menu.contents);

    this.setState({ body, loading:false });
  }

  render() {
    const { body, menu } = this.state;

    return <nav id="nav-main">
      <li>
        <Link to="/">Home</Link>
        <Link to="/campaigns/TOS">Example Article</Link>
      </li>
      <div dangerouslySetInnerHTML={{ __html:body }}></div>
    </nav>
  }


}

export default withRouter(TopMenu);
