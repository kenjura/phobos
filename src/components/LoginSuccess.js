import React from 'react';

import { getLogin, ingestAccessToken } from '../model/services/dropbox.js';
import { handleError } from '../helpers/handleError';
import { Link } from 'react-router-dom';
import { parse } from 'query-string';

export default class LoginSuccess extends React.Component {
  constructor() {
    super();

    this.state = {
      postLoginUrl: null,
    }
  }

  componentDidMount() {
    console.log('LoginSuccess');
    this.start(this.props);
  }

  start({ history, location }) {
    const { hash } = location;
    const { access_token, state } = parse(hash);

    const ingestResult = ingestAccessToken(access_token);

    const { postLoginUrl } = JSON.parse(state) || {};
    this.setState({ postLoginUrl });

    if (postLoginUrl) history.push(postLoginUrl); // TODO: validate this a bit more

    return { access_token, ingestResult };

  }

  render() {
    const { postLoginUrl } = this.state;
    return postLoginUrl
      // ? <div>redirecting to <Link to={postLoginUrl}>{postLoginUrl}</Link></div>
      ? <div>TEMP MESSAGE: login successful. post login url = <a href={postLoginUrl}>{postLoginUrl}</a></div>
      : <div>login was successful, but we don't know where to go from here for some reason. <Link to="/">click here</Link> to go home.</div>;
  }

}