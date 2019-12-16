import { cascadePath, resolveMenuOrStyle, scoreMenu } from '../../../src/helpers/resolver';

const { candidates, fileLists, scoredCandidates } = getTestData();

test('cascadePath > test case 1', () => {
	const startPath = '/foo/bar/baz/qux/xyzzy';
	const rootPath = '/';
	const expected = [ '/', '/foo', '/foo/bar', '/foo/bar/baz', '/foo/bar/baz/qux', '/foo/bar/baz/qux/xyzzy' ];
	const actual = cascadePath({ rootPath, startPath });
	expect(actual).toStrictEqual(expected);
})

test('cascadePath > test case 2', () => {
	const startPath = '/foo/bar/baz/qux/xyzzy';
	const rootPath = '/foo/';
	const expected = [ '/foo', '/foo/bar', '/foo/bar/baz', '/foo/bar/baz/qux', '/foo/bar/baz/qux/xyzzy' ];
	const actual = cascadePath({ rootPath, startPath });
	expect(actual).toStrictEqual(expected);
})

test('cascadePath > test case 2b', () => {
	const startPath = '/foo/bar/baz/qux/xyzzy';
	const rootPath = '/foo';
	const expected = [ '/foo', '/foo/bar', '/foo/bar/baz', '/foo/bar/baz/qux', '/foo/bar/baz/qux/xyzzy' ];
	const actual = cascadePath({ rootPath, startPath });
	expect(actual).toStrictEqual(expected);
})

test('cascadePath > test case 3', () => {
	const startPath = '/foo';
	const rootPath = '/';
	const expected = [ '/', '/foo' ];
	const actual = cascadePath({ rootPath, startPath });
	expect(actual).toStrictEqual(expected);
})

test('resolveMenuOrStyle > gets list of candidates correctly', () => {
	const fileList = fileLists[1];
	const fuzzypath = '/foo';
	const which = 'menu';
	const expected = candidates.menu[1];
	const actual = resolveMenuOrStyle({ fileList, fuzzypath, which, debug:'candidates' }).candidates;
	expect(actual).toStrictEqual(expected);
})

test('scoreMenu > test case 1', () => {
	const candidate = '/menu.html';
	const fuzzypath = '/foo';
	const expected = [0,-1,0];
	const actual = scoreMenu({ candidate, fuzzypath });
	expect(actual).toStrictEqual(expected);
})

test('scoreMenu > test case 2', () => {
	const candidate = '/foo/menu.html';
	const fuzzypath = '/foo';
	const expected = [-1,-5,0];
	const actual = scoreMenu({ candidate, fuzzypath });
	expect(actual).toStrictEqual(expected);
})

test('scoreMenu > test case 3', () => {
	const candidate = '/foo/menu.html';
	const fuzzypath = '/foo/bar';
	const expected = [0,-5,0];
	const actual = scoreMenu({ candidate, fuzzypath });
	expect(actual).toStrictEqual(expected);
})

test('resolveMenuOrStyle > scores candidates correctly', () => {
	const fileList = fileLists[1];
	const fuzzypath = '/foo';
	const which = 'menu';
	const expected = scoredCandidates.menu[1];
	const actual = resolveMenuOrStyle({ fileList, fuzzypath, which, debug:'scoredCandidates' }).scoredCandidates;
	expect(actual).toStrictEqual(expected);
})

test('resolveMenuOrStyle > returns correct candidate test case 1 ', () => {
	const fileList = fileLists[1];
	const fuzzypath = '/foo';
	const which = 'menu';
	const expected = '/foo/menu.md';
	const actual = resolveMenuOrStyle({ fileList, fuzzypath, which }).hardpath;
	expect(actual).toStrictEqual(expected);
})

test('resolveMenuOrStyle > returns correct candidate test case 2 ', () => {
	const fileList = fileLists[1];
	const fuzzypath = '/';
	const which = 'menu';
	const expected = '/menu.html';
	const actual = resolveMenuOrStyle({ fileList, fuzzypath, which }).hardpath;
	expect(actual).toStrictEqual(expected);
})

test('resolveMenuOrStyle > returns correct candidate test case 3 ', () => {
	const fileList = fileLists[1];
	const fuzzypath = '/foo.md';
	const which = 'menu';
	const expected = '/menu.html';
	const actual = resolveMenuOrStyle({ fileList, fuzzypath, which }).hardpath;
	expect(actual).toStrictEqual(expected);
})

// warning: this test is invalid; fileLists[1] is not the correct candidate list for /foo/bar
// test.skip('resolveMenuOrStyle > returns correct candidate test case 3 ', () => {
// 	const fileList = fileLists[1];
// 	const fuzzypath = '/foo/bar';
// 	const which = 'menu';
// 	const expected = '/foo/_menu.html';
// 	const actual = resolveMenuOrStyle({ fileList, fuzzypath, which }).candidate;
// 	expect(actual).toStrictEqual(expected);
// })



function getTestData() {
	return {
		fileLists: {
			1: [
				'/menu.html',
				'/_menu.yml',
				'/foo/',
				'/foo/menu.md',
				'/foo/menu.txt',
			]
		},
		candidates: {
			menu: {
				1: [
					'/_menu.html',
					'/_menu.yml',
					'/_menu.md',
					'/_menu.txt',
					'/menu.html',
					'/menu.yml',
					'/menu.md',
					'/menu.txt',
					'/foo/_menu.html',
					'/foo/_menu.yml',
					'/foo/_menu.md',
					'/foo/_menu.txt',
					'/foo/menu.html',
					'/foo/menu.yml',
					'/foo/menu.md',
					'/foo/menu.txt',
				]
			}
		},
		scoredCandidates: {
			menu: {
				1: [
					{ hardpath:'/_menu.yml',      score:[0,-1,1] },
					{ hardpath:'/menu.html',      score:[0,-1,0] },
					{ hardpath:'/foo/menu.md',   score:[-1,-5,2] },
					{ hardpath:'/foo/menu.txt',  score:[-1,-5,3] },
				],
			},
		}
	}
}