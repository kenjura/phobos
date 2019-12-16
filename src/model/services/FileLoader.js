import File from '../classes/File.js';
import FileList from '../classes/FileList.js';

import { downloadFile } from '../services/dropbox.js';
import { getExtension, parseFileMetadata } from '../../helpers/parseFileMetadata.js';
import { resolveArticle, resolveMenuOrStyle } from '../../helpers/resolver.js';

export { load, resolveAndLoad };

async function load({ file, _downloadFile=downloadFile }={}) {
	if (!file) throw new Error('FileLoader > load > requires argument "file"');
	if (!file instanceof File) throw new Error('FileLoader > load > argument "file" must be an instance of File');
	if (!file.hardpath) throw new Error('FileLoader > load > file does not have a hardpath.');
	// if (!downloadFile) throw new Error('FileLoader > load > requires argument "downloadFile"');

	const content = await _downloadFile({ hardpath:file.hardpath });
	file.contents = content;
	file.loaded = true;
	file.loadedAt = Date.now();

	return file;
}

async function resolveAndLoad({ fileList, fuzzypath, _downloadFile, type }) {
	if (!fileList) throw new Error('FileLoader > resolveAndLoad > requires argument "fileList"');
	if (!Array.isArray(fileList)) throw new Error('FileLoader > resolveAndLoad > argument "fileList" must be a valid FileList');
	if (!fuzzypath) throw new Error('FileLoader > resolveAndLoad > requires argument "fuzzypath"');
	if (!type) throw new Error('FileLoader > resolveAndLoad > requires argument "type" (value: article || menu || style)');

	const metadata = parseFileMetadata(fuzzypath);
	const resolver = type === 'article' ? resolveArticle : resolveMenuOrStyle;
	const resolution = resolver({ fileList, fuzzypath, which:type });
	if (!resolution) return null;
	const { hardpath } = resolution;
	const file = new File(metadata);
	file.extension = getExtension(hardpath);
	file.hardpath = hardpath;
	await load({ file, _downloadFile });
	return file;
}