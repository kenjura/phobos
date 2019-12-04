import { getFileContents } from './dropbox.js';

export { getFile, dummyTest };

async function dummyTest() {
	return 'dummy';
}

async function getFile(args={}) {
	const { getFileContents=getFileContents, hardpath } = args;
	console.assert(getFileContents);
	console.assert(hardpath);

	console.warn('file > getFile > mock implementation only! returning dummy data!');

	return {
		hardpath,
		filename: 'my-file.md',
		extension: 'md',
		mimeType: 'text/markdown',
		contents: 'hello, this is a markdown file',
		timestamp: Date.now(),
	}
}