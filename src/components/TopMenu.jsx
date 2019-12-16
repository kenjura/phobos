import React from 'react';

import { load } from '../model/services/ArticleLoader';
import { render } from '../helpers/ArticleRenderer';
import { Link, withRouter } from 'react-router-dom';

import './TopMenu.scss';

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
    const body = render(menu);

    this.setState({ body, loading:false });
  }

  render() {
    const { body, menu } = this.state;

    return <nav id="top-menu">
      {/*<li>
        <Link to="/">Home</Link>
        <Link to="/campaigns/TOS">Example Article</Link>
      </li>*/}
      <div className="dropdown-menu" dangerouslySetInnerHTML={{ __html:body }}></div>
    </nav>
  }


}

export default withRouter(TopMenu);
