import { getAutoIndex, load, save } from '../model/services/ArticleLoader';
import { Link } from 'react-router-dom';
import { render, sectionify } from '../helpers/ArticleRenderer';
import { Icon, Tooltip } from 'antd';

import React, { useEffect, useState } from 'react';

import './Article.scss';

export default class Article extends React.Component {
	constructor(props) {
		super(props);

		const searchParams = new URLSearchParams(props.location.search)
		const mode = searchParams.get('mode');

		this.state = {
			articlePath: '',
			article: {},
			autoIndex: [],
			fileList: [],
			loading: false,
			mode: mode === 'edit' ? 'edit' : 'view',
			raw: '',
		};

		this.submit = this.submit.bind(this);
	}

	componentDidMount() {
		this.start();
	}
 
	async start() {
		const { location } = this.props;
		if (!location || !location.pathname) throw new Error('Article > somehow, article path is not available. This is the end, folks.');

		const fuzzypath = location.pathname;

		const { article } = await load({ fuzzypath });
		const body = article ? sectionify(render(article)) : 'no article found';
		const raw = article.contents;
		const autoIndex = article ? [] : await getAutoIndex({ fuzzypath });
		const hardpath = article ? article.hardpath : fuzzypath;

		this.setState({ article, autoIndex, body, hardpath, loading:false, raw });
	}

	async submit(contents) {
		const hardpath = this.state.article.hardpath;
		const result = await save({ hardpath, contents });
		console.log(result);
		alert(result);
	}

	render() {
		const { article, articlePath, autoIndex, body, content, fileList, hardpath, loading, mode, raw } = this.state;

		const articleMetadata = <ArticleMetadata {...article} />;

		return <article className="article">

			{ autoIndex.length ? 
				<div id="mainContent">
					No article found at this location. Here is an index:

					<ul>
						{ autoIndex.map(i => <li key={i}><Link to={i}>{i}</Link></li>) }
					</ul>
				</div>
			:
				mode === 'view' ?
					<div id="mainContent" dangerouslySetInnerHTML={{ __html:body }}>
					</div>
				:
					<Edit body={raw} onSubmit={this.submit} />
			}

			{ loading ? 'loading...' : '' }

			<Tooltip title={articleMetadata}>
				<Icon type="question-circle" id="article-debug-info" />
			</Tooltip>
		</article>
	}
}

const ArticleMetadata = props => <div>
	<table style={{ color:'white' }}>
		<tbody>
			<tr>
				<th>Extension</th>
				<td>{ props.extension }</td>
			</tr>
			<tr>
				<th>Filename</th>
				<td>{ props.filename }</td>
			</tr>
			<tr>
				<th>Path</th>
				<td>{ props.hardpath }</td>
			</tr>
			<tr>
				<th>Title</th>
				<td>{ props.title }</td>
			</tr>
			<tr>
				<th>Type</th>
				<td>{ props.type }</td>
			</tr>
		</tbody>
	</table>
</div>


const Edit = props => {
	const [ body, setBody ] = useState('');

	useEffect(() => setBody(props.body), [props.body]);

	const submit = e => {
		e.preventDefault();
		props.onSubmit(body);
	}

	return	<form id="article-edit" onSubmit={submit}>
		<textarea value={body} onChange={e => setBody(e.target.value)} />
		<input type="submit" />
	</form>
}

const FileList = props => <div style={{ background:'#EEE', margin:'20px' }}>
	<ul>
		{ props.fileList.map(file => <li key={file}>{file}</li>) }
	</ul>
</div>