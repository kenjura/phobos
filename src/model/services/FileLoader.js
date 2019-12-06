import File from '../classes/File.js';
import FileList from '../classes/FileList.js';

import { downloadFile } from '../services/dropbox.js';
import { parseFileMetadata } from '../../helpers/parseFileMetadata.js';
import { resolveArticle } from '../../helpers/resolver.js';

export { load, resolveAndLoad };

async function load({ file, downloader }={}) {
	if (!file) throw new Error('FileLoader > load > requires argument "file"');
	if (!file instanceof File) throw new Error('FileLoader > load > argument "file" must be an instance of File');
	if (!file.hardpath) throw new Error('FileLoader > load > file does not have a hardpath.');
	// if (!downloadFile) throw new Error('FileLoader > load > requires argument "downloadFile"');
	if (!downloader) downloader = downloadFile;

	const content = await downloader({ hardpath:file.hardpath });
	file.contents = content;
	file.loaded = true;
	file.loadedAt = Date.now();

	return file;
}

async function resolveAndLoad({ fileList, fuzzypath, downloadFile }) {
	if (!fileList) throw new Error('FileLoader > resolveAndLoad > requires argument "fileList"');
	if (!Array.isArray(fileList)) throw new Error('FileLoader > resolveAndLoad > argument "fileList" must be a valid FileList');
	if (!fuzzypath) throw new Error('FileLoader > resolveAndLoad > requires argument "fuzzypath"');

	const metadata = parseFileMetadata(fuzzypath);
	const resolution = resolveArticle({ fileList, fuzzypath });
	const { hardpath } = resolution;
	const file = new File(metadata);
	file.hardpath = hardpath;
	await load({ file, downloadFile });
	return file;
}