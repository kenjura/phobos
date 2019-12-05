import FileList from '/model/classes/FileList.js';

import { resolveArticle } from '/model/services/FileLoader.js';

const { expect } = chai; // chai isn't an ES module. the test harness loaded it globally. sigh
const { fileList } = getMockData();

describe('FileLoader > resolveArticle', async () => {
	it('correctly resolves "/foo.md"', () => {
		const fuzzypath = '/foo.md';
		const actual = resolveArticle({ fileList, fuzzypath });
		expect(actual).to.eq(7);
	});
});


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
