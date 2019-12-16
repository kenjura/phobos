import { downloadFile, getFileList as _getFileList } from './dropbox';
import { resolveAndLoad } from './FileLoader';
import { resolveMenuOrStyle } from '../../helpers/resolver';
import { loadFileList } from './FileListLoader';
import { markdownToHtml } from '../../helpers/markdownHelper';
import { memoize } from '../../helpers/memoize';

export { load };

async function load({ fuzzypath, getFileList=_getFileList, _downloadFile }={}) {
	if (!fuzzypath) throw new Error('Article > load > fuzzypath is required');

	const fileList = await loadFileList({ getFileList });
	const args = { _downloadFile, fuzzypath, fileList };

	const [ article, menu, style ] = await Promise.all([ loadArticle(args), loadMenu(args), loadStyle(args) ]);

	return { article, menu, style };
}

async function _loadArticle({ _downloadFile, fuzzypath, fileList }) {
	const file = await resolveAndLoad({ fileList, fuzzypath, _downloadFile, type:'article' });
	return file;
}

async function _loadMenu({ _downloadFile, fuzzypath, fileList }) {
	const file = await resolveAndLoad({ fileList, fuzzypath, _downloadFile, type:'menu' });
	return file;
}

async function _loadStyle({ _downloadFile, fuzzypath, fileList }) {
	const file = await resolveAndLoad({ fileList, fuzzypath, _downloadFile, type:'style' });
	return file;
}

const loadArticle = memoize(_loadArticle);
const loadMenu = memoize(_loadMenu);
const loadStyle = memoize(_loadStyle);