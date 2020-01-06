import { getAutoIndex, load } from '../model/services/ArticleLoader';
import { Link } from 'react-router-dom';
import { render, sectionify } from '../helpers/ArticleRenderer';
import { Icon, Tooltip } from 'antd';

import React from 'react';

import './Article.scss';

export default class Article extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			articlePath: '',
			article: {},
			autoIndex: [],
			fileList: [],
			loading: false,
		}
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
		const autoIndex = article ? [] : await getAutoIndex({ fuzzypath });
		const hardpath = article ? article.hardpath : fuzzypath;

		this.setState({ article, autoIndex, body, hardpath, loading:false });
	}

	render() {
		const { article, articlePath, autoIndex, body, content, fileList, hardpath, loading } = this.state;

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
				<div id="mainContent" dangerouslySetInnerHTML={{ __html:body }}>
				</div>
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

const FileList = props => <div style={{ background:'#EEE', margin:'20px' }}>
	<ul>
		{ props.fileList.map(file => <li key={file}>{file}</li>) }
	</ul>
</div>