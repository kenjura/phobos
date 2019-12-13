import { downloadFile, getFileList } from './dropbox';
import { resolveAndLoad } from './FileLoader';
import { resolveMenuOrStyle } from '../../helpers/resolver';
import { loadFileList } from './FileListLoader';
import { markdownToHtml } from '../../helpers/markdownHelper';

export { load };

async function load({ fuzzypath, getFileList, _downloadFile }={}) {
	if (!fuzzypath) throw new Error('Article > load > fuzzypath is required');

	const fileList = await loadFileList({ getFileList });
	const args = { _downloadFile, fuzzypath, fileList };

	const [ article, menu, style ] = await Promise.all([ loadArticle(args), loadMenu(args), loadStyle(args) ]);

	return { article, menu, style };
}

async function loadArticle({ _downloadFile, fuzzypath, fileList }) {
	const file = await resolveAndLoad({ fileList, fuzzypath, _downloadFile, type:'article' });
	return file;
}

async function loadMenu({ _downloadFile, fuzzypath, fileList }) {
	const file = await resolveAndLoad({ fileList, fuzzypath, _downloadFile, type:'menu' });
	return file;
}

async function loadStyle({ _downloadFile, fuzzypath, fileList }) {
	const file = await resolveAndLoad({ fileList, fuzzypath, _downloadFile, type:'style' });
	return file;
}


function memoize(method) {
    let cache = {};
    
    return async function() {
        let args = JSON.stringify(arguments);
        cache[args] = cache[args] || method.apply(this, arguments);
        return cache[args];
    };
}