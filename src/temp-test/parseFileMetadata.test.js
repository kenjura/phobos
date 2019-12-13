import { getExtension, getFilename, getPath, getStartPath, getType } from '/helpers/parseFileMetadata.js';

const { expect } = chai; // chai isn't an ES module. the test harness loaded it globally. sigh
const { files } = getMockData();

describe('parseFileMetadata > getExtension', async () => {
	Object.values(files).map(test);
	function test(file) {
		it(`knows that the filepath "${file.filepath}" has extension "${file.extension}"`, () => {
			expect(getExtension(file.filepath)).to.eq(file.extension);
		});
	}
});

describe('parseFileMetadata > getFilename', async () => {
	Object.values(files).map(test);
	function test(file) {
		it(`knows that the filepath "${file.filepath}" has filename "${file.filename}"`, () => {
			expect(getFilename(file.filepath)).to.eq(file.filename);
		});
	}
});

describe('parseFileMetadata > getPath', async () => {
	Object.values(files).map(test);
	function test(file) {
		it(`knows that the filepath "${file.filepath}" has path "${file.path}"`, () => {
			expect(getPath(file.filepath)).to.eq(file.path);
		});
	}
});

describe('parseFileMetadata > getType', async () => {
	Object.values(files).map(test);
	function test(file) {
		it(`knows that the filepath "${file.filepath}" has type "${file.type}"`, () => {
			expect(getType(file.filepath)).to.eq(file.type);
		});
	}
});

test('parseFileMetadata > getStartPath', async () => {
	const fuzzypath = '/foo';
	const expected = '/foo/';
	const actual = getStartPath(fuzzypath);
	expect(actual).toBe(expected);
});

function getMockData() {
	return {
		files: {
			0: { filepath:'/',                 path:'/',        filename:null,       extension:null, type:'folder' },
			1: { filepath:'/foo/bar.md',       path:'/foo',     filename:'bar.md',   extension:'.md', type:'file' },
			2: { filepath:'/foo/bar',          path:'/foo',     filename:'bar',      extension:null,  type:'ambiguous' },
			3: { filepath:'/foo/',             path:'/foo',     filename:null,       extension:null,  type:'folder' },
			4: { filepath:'/foo',              path:'/',        filename:'foo',      extension:null,  type:'ambiguous' },
			5: { filepath:'/foo.md',           path:'/',        filename:'foo.md',   extension:'.md', type:'file' },
			6: { filepath:'foo.md',            path:'.',        filename:'foo.md',   extension:'.md', type:'file' },
			7: { filepath:'foo',               path:'.',        filename:'foo',      extension:null,  type:'ambiguous' },
			8: { filepath:'/foo/foo.md',       path:'/foo',     filename:'foo.md',   extension:'.md', type:'file' },
			9: { filepath:'/foo/foo/index.md', path:'/foo/foo', filename:'index.md', extension:'.md', type:'file' },
		},
	}
}
