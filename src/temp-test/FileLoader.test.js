import File from '/model/classes/File.js';
import FileList from '/model/classes/FileList.js';

import { load, resolveAndLoad } from '/model/services/FileLoader.js';

const { expect } = chai; // chai isn't an ES module. the test harness loaded it globally. sigh
const { DropboxFileLoader } = getMockServices();
const { fileList } = getMockData();

describe('FileLoader > load', async () => {
	const { downloadFile } = DropboxFileLoader;

	it('loads "/foo.md"', async () => {
		const fuzzypath = '/foo.md';
		const actual = await resolveAndLoad({ fileList, fuzzypath, downloadFile });
		expect(actual.contents).to.eq('file contents');
	});
});

function getMockServices() {
	return {
		DropboxFileLoader: {
			downloadFile: path => 'file contents',
		}
	}
}

function getMockData() {
	return {
		fileList: new FileList({}, ...[
			'/index.md',
			'/foo.html',
			'/foo.md',
			'/foo.txt',
			'/foo/index.html',
			'/foo/index.md',
			'/foo/foo.md',
			'/foo/foo.txt',
			'/foo/foo/index.html',
			'/foo/bar.html',
			'/foo/bar/index.html',
			'/foo/bar/bar.html',
		]),
	}
}
