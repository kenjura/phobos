import React from 'react';
import LoginSuccess from '../../../src/components/LoginSuccess';

import * as dropbox from '../../../src/model/services/dropbox';

import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';

describe('LoginSuccess', () => {
	let startFn;
	beforeEach(() => {
		const fakeLocalStorage = {
			postLoginUrl:'http://post.login.url/',
		};		
		startFn = jest.spyOn(LoginSuccess.prototype, 'start');
		jest.spyOn(dropbox, 'ingestAccessToken').mockImplementation(token => {
			if (token && typeof(token) === 'string') return `ACCEPTED:${token}`;
			else return 'FAILED';
		});
	})

	test('LoginSuccess > correctly parses location to get access_token', () => {
		const history = {
			push: url => url,
		}
		const location = {
			pathname: '/login/success',
			search: '',
			hash: '#access_token=qwertyuiop&token_type=bearer&uid=123456&account_id=12345678',
		};
		const props = { location };
		const expected = {
			access_token: 'qwertyuiop',
			ingestResult: 'ACCEPTED:qwertyuiop',
			// postLoginUrl: 'http://post.login.url/',
		};

		const wrapper = mount(<Router><LoginSuccess {...props} /></Router>); 
		expect(startFn).toHaveBeenCalled();
		expect(startFn).toHaveReturnedWith(expected);
	})

	afterEach(() => {
		jest.clearAllMocks();
	});
})


function start({ location }) {
    const { hash } = location;
    const { access_token } = parse(hash);

    return access_token;
}



