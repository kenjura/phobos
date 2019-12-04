// import { expect } from 'chai';
// import { getFile } from '../../../src/model/file.js';

import { getFile, dummyTest } from '/model/file.js';


const { expect } = chai; // chai isn't an ES module. the test harness loaded it globally. sigh
const { files } = getMockData();
const { dropbox } = getMockServices();

describe('test 1', async () => {
  it('dummies', async () => {
    const hardpath = 'dummy';
    // const getFileContents = () => 
    const actual = await dummyTest();
    const expected = 'dummy';
    expect(actual).to.eq(expected);
  })
})

describe('file > getFile', async () => {
  it('gets a dummy file', async () => {
    const hardpath = 'dummy';
    const { getFileContents } = dropbox;
    const actual = await getFile({ getFileContents, hardpath });
    const expected = files.dummy;
    expect(actual.filename).to.eql(expected.filename);
    expect(actual.contents).to.eql(expected.contents);
    expect(actual.extension).to.eql(expected.extension);
  })
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
				hardpath: 'dummy.md',
				filename: 'my-file.md',
				extension: 'md',
				mimeType: 'text/markdown',
				contents: 'hello, this is a markdown file',
				timestamp: Date.now(),
			}
		}
	}
}
