import React from 'react';

import { getLogin, ingestAccessToken } from '../model/services/dropbox.js';
import { handleError } from '../helpers/handleError';
import { parse } from 'query-string';

export default class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      loginUrl: null,
    }
  }

  componentDidMount() {
    const { history, location } = this.props;
    const { search } = location;
    const { access_token, postLoginUrl } = parse(search);

    localStorage.setItem('postLoginUrl', postLoginUrl);

    const returnUrl = window.location.origin + '/login/success';

    // if (returnUrl === 'success') {
      // ingestAccessToken(access_token);
      // const url = localStorage.getItem('returnUrl'); // TODO: no! no!
      // history.push(url);
    // } else {
      getLogin({ returnUrl })
        .then(loginUrl => this.setState({ loginUrl }))
        .catch(err => console.error(err));
    // }
  }

  render() {
    const { loginUrl } = this.state;
    return loginUrl ? <a href={loginUrl}>log in to dropbox</a> : <div>should be redirecting...</div>;
  }

}