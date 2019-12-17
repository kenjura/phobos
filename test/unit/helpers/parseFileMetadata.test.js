import { getExtension, getFilename, getPath, getStartPath, getType } from '../../../src/helpers/parseFileMetadata.js';

const { files } = getMockData();

(function() {
	Object.values(files).map(doTest);
	function doTest(file) {
		test(`parseFileMetadata > getExtension > knows that the filepath "${file.filepath}" has extension "${file.extension}"`, () => {
			expect(getExtension(file.filepath)).toBe(file.extension);
		});
	}
})();

(function() {
	Object.values(files).map(doTest);
	function doTest(file) {
		test(`parseFileMetadata > getFilename > knows that the filepath "${file.filepath}" has filename "${file.filename}"`, () => {
			expect(getFilename(file.filepath)).toBe(file.filename);
		});
	}
})();

(function() {
	Object.values(files).map(doTest);
	function doTest(file) {
		test(`parseFileMetadata > getPath > knows that the filepath "${file.filepath}" has path "${file.path}"`, () => {
			expect(getPath(file.filepath)).toBe(file.path);
		});
	}
})();

(function() {
	Object.values(files).map(doTest);
	function doTest(file) {
		test(`parseFileMetadata > getType > knows that the filepath "${file.filepath}" has type "${file.type}"`, () => {
			expect(getType(file.filepath)).toBe(file.type);
		});
	}
})();

test('parseFileMetadata > getStartPath > test case 1', async () => {
	const fuzzypath = '/foo';
	const expected = '/foo/';
	const actual = getStartPath(fuzzypath);
	expect(actual).toBe(expected);
});

test('parseFileMetadata > getStartPath > test case 2', async () => {
	const fuzzypath = '/foo/';
	const expected = '/foo/';
	const actual = getStartPath(fuzzypath);
	expect(actual).toBe(expected);
});

test('parseFileMetadata > getStartPath > test case 3', async () => {
	const fuzzypath = '/';
	const expected = '/';
	const actual = getStartPath(fuzzypath);
	expect(actual).toBe(expected);
});

function getMockData() {
	return {
		files: {
			0: { filepath:'/',                 path:'/',        filename:null,       extension:null,  type:'folder' },
			1: { filepath:'/foo/bar.md',       path:'/foo',     filename:'bar.md',   extension:'.md', type:'file' },
			2: { filepath:'/foo/bar',          path:'/foo',     filename:'bar',      extension:null,  type:'ambiguous' },
			3: { filepath:'/foo/',             path:'/foo',     filename:null,       extension:null,  type:'folder' },
			4: { filepath:'/foo',              path:'/',        filename:'foo',      extension:null,  type:'ambiguous' },
			5: { filepath:'/foo.md',           path:'/',        filename:'foo.md',   extension:'.md', type:'file' },
			6: { filepath:'foo.md',            path:'.',        filename:'foo.md',   extension:'.md', type:'file' },
			7: { filepath:'foo',               path:'.',        filename:'foo',      extension:null,  type:'ambiguous' },
			8: { filepath:'/foo/foo.md',       path:'/foo',     filename:'foo.md',   extension:'.md', type:'file' },
			9: { filepath:'/foo/foo/index.md', path:'/foo/foo', filename:'index.md', extension:'.md', type:'file' },
			10: { filepath:'/1.2.3',           path:'/',        filename:'1.2.3',    extension:null,  type:'ambiguous' },
		},
	}
}
