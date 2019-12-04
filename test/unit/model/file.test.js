import { expect } from 'chai';
import { getFile } from '../../../src/model/file.js';

const { files } = getMockData();
const { dropbox } = getMockServices();

test('file > getFile', async () => {
	const hardpath = 'dummy';
	const actual = await getFile({ dropbox, hardpath });
	const expected = files.dummy;
	assertDeepStrictEqual(actual, expected, 'actual != expected');
})



function test(name, fn) {
	console.log(name);
	fn();
}


function getMockServices() {
	const mockData = getMockData();

	return {
		dropbox: {
			getFileContents: hardpath => {
				switch (hardpath) {
					case 'dummy': return mockData.files.dummy;
					default: throw new Error('unknown hardpath');
				}
			},
		}
	}
}

function getMockData() {
	return {
		files: {
			dummy: {
				hardpath,
				filename: 'my-file.md',
				extension: 'md',
				mimeType: 'text/markdown',
				contents: 'hello, this is a markdown file',
				timestamp: Date.now(),
			}
		}
	}
}
