import { downloadFile, getFileList as _getFileList } from './dropbox';
import { resolveAndLoad } from './FileLoader';
import { resolveMenuOrStyle } from '../../helpers/resolver';
import { loadFileList } from './FileListLoader';
import { markdownToHtml } from '../../helpers/markdownHelper';
import { memoize } from '../../helpers/memoize';

const loadArticle = memoize(_loadArticle);
const loadMenu = memoize(_loadMenu);
const loadStyle = memoize(_loadStyle);

export { getAutoIndex, load, loadArticle, loadMenu, loadStyle };

async function getAutoIndex({ fuzzypath, getFileList=_getFileList, _downloadFile=downloadFile }) {
	if (!fuzzypath) throw new Error('Article > load > fuzzypath is required');

	const fileList = await loadFileList({ getFileList });
	const autoIndex = fileList
		.map(f => f.toLowerCase())
		.filter(f => f.indexOf(fuzzypath)===0)
		.filter(f => f.replace(fuzzypath, '').lastIndexOf('/')===0);
		// .map(f => f.replace(fuzzypath, ''));//

	return autoIndex;
}

async function load({ fuzzypath, getFileList=_getFileList, _downloadFile }={}) {
	if (!fuzzypath) throw new Error('Article > load > fuzzypath is required');

	const fileList = await loadFileList({ getFileList });
	const args = { _downloadFile, fuzzypath, fileList };

	const [ article, menu, style ] = await Promise.all([ loadArticle(args), loadMenu(args), loadStyle(args) ]);

	return { article, menu, style };
}

async function _loadArticle({ _downloadFile, fuzzypath, fileList }) {
	try {
		return await resolveAndLoad({ fileList, fuzzypath, _downloadFile, type:'article' });
	} catch(e) {
		console.error(e);
		return null;
	}
}

async function _loadMenu({ _downloadFile, fuzzypath, fileList }) {
	const file = await resolveAndLoad({ fileList, fuzzypath, _downloadFile, type:'menu' });
	return file;
}

async function _loadStyle({ _downloadFile, fuzzypath, fileList }) {
	const file = await resolveAndLoad({ fileList, fuzzypath, _downloadFile, type:'style' });
	return file;
}