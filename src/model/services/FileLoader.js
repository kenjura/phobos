import File from '/model/classes/File.js';
import FileList from '/model/classes/FileList.js';

import { parseFileMetadata } from '/helpers/parseFileMetadata.js';
import { resolveArticle } from '/helpers/resolver.js';

export { load, resolveAndLoad };

async function load({ file, downloadFile=downloadFile }={}) {
	if (!file) throw new Error('FileLoader > load > requires argument "file"');
	if (!file instanceof File) throw new Error('FileLoader > load > argument "file" must be an instance of File');
	if (!file.hardpath) throw new Error('FileLoader > load > file does not have a hardpath.');
	if (!downloadFile) throw new Error('FileLoader > load > requires argument "downloadFile"');

	const content = await downloadFile({ path:file.hardpath });
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
	const { hardpath } = resolveArticle({ fileList, fuzzypath });
	const file = new File(metadata);
	file.hardpath = hardpath;
	await load({ file, downloadFile });
	return file;
}

const downloadFile = async function({ path }) {
	// mock of DropboxFileLoader.downloadFile

	return 'file contents!';
}