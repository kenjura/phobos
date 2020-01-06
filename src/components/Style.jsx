import PropTypes from 'prop-types';
import React from 'react';

import { load } from '../model/services/ArticleLoader';

export default class Style extends React.Component {
	static propTypes = {
		css: PropTypes.string.isRequired,
	}

	constructor(props) {
		super(props);
	}

	render() {
		const { css } = this.props;

		return <style dangerouslySetInnerHTML={{ __html:css }}></style>
	}
}

export class StyleLoader extends React.Component {
	static propTypes = {
		location: PropTypes.shape({
			pathname: PropTypes.string.isRequired,
		}),
	}

	constructor(props) {
		super(props);

		this.state = {
			css:'',
		}
	}

	componentDidMount() {
		this.start();
	}

	async start() {
		const fuzzypath = this.props.location.pathname;
		const { style } = await load({ fuzzypath });
		const css = style.contents;

		this.setState({ css });
	}

	render() {
		const { css } = this.state;
		return <Style css={css} />
	}
}