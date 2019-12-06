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
    const { history } = this.props;
    const { search } = location;
    const { access_token } = parse(search);

    ingestAccessToken(access_token);

    const postLoginUrl = localStorage.getItem('postLoginUrl');
    this.setState({ postLoginUrl });

    if (postLoginUrl) history.push(postLoginUrl);
  }

  render() {
    const { postLoginUrl } = this.state;
    return postLoginUrl
      ? <div>redirecting to <Link to={postLoginUrl}>{postLoginUrl}</Link></div>
      : <div>login was successful, but we don't know where to go from here for some reason. <Link to="/">click here</Link> to go home.</div>;
  }

}