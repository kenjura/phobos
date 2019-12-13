import { downloadFile, getFileList } from '../model/services/dropbox';
import { loadFileList } from '../model/services/FileListLoader';
import { markdownToHtml } from '../helpers/markdownHelper';
import { resolveAndLoad } from '../model/services/FileLoader';
import { parseFileMetadata } from '../helpers/parseFileMetadata';

import React from 'react';

export default class Article extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			articlePath: '',
			article: null,
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

		const articlePath = location.pathname;
		const articleMetadata = parseFileMetadata(articlePath);

		this.setState({ articleMetadata, articlePath, loading:true });

		const fileList = await loadFileList({ getFileList });
		this.setState({ fileList });

		const fuzzypath = articlePath;
		const file = await resolveAndLoad({ fileList, fuzzypath, downloadFile, type:'article' });
		const content = file.contents;
		const body = markdownToHtml(content); // TODO: use article.render(), don't just assume markdown

		this.setState({ body, content, loading:false });
	}

	render() {
		const { articleMetadata, articlePath, body, content, fileList, loading } = this.state;

		return <article className="article">

			<div id="main-content" dangerouslySetInnerHTML={{ __html:body }}>
			</div>
			<ArticleMetadata {...articleMetadata} />
			<FileList fileList={fileList} />

			{ loading ? 'loading...' : '' }
		</article>
	}
}

const ArticleMetadata = props => <div style={{ background:'#EEE', margin:'20px' }}>
	<table>
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
				<td>{ props.path }</td>
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