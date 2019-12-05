import { getArticleCandidates, resolveArticle } from '/helpers/resolver.js';

const { expect } = chai; // chai isn't an ES module. the test harness loaded it globally. sigh
const { testCases } = getTestData();

describe('resolver', () => {
	// testCases.forEach(testCase => {
	// 	it(`scores ${first(testCase)} lower than ${last(testCase)}`, () => {
	// 		const sorted = sortByScore(testCase);
	// 		const expected = last(testCase);
	// 		const actual = last(sorted);
	// 		expect(actual).to.eql(expected);
	// 	})
	// })

	testCases.forEach(({ candidates, fileList, fuzzypath }) => {
		it(`correctly produces candidate list for ${fuzzypath}`, () => {
			const actual = getArticleCandidates(fuzzypath);
			const expected = candidates;
			expect(actual).to.eql(expected);
		});
		it(`resolves fuzzy path "${fuzzypath}"`, () => {
			const actual = resolveArticle({ fileList, fuzzypath });
		})
	})
});

function first(arr) { return arr[0] };
function last(arr) { return arr[arr.length-1] };

function getTestData() {
	const candidateLists = {
		'/foo': [
			{ hardpath:'/foo/foo.html', score:[2,1,1] },
			{ hardpath:'/foo/foo.md', score:[2,1,2] },
			{ hardpath:'/foo/foo.txt', score:[2,1,3] },
			{ hardpath:'/foo/index.html', score:[2,2,1] },
			{ hardpath:'/foo/index.md', score:[2,2,2] },
			{ hardpath:'/foo/index.txt', score:[2,2,3] },
			{ hardpath:'/foo.html', score:[2,3,1] },
			{ hardpath:'/foo.md', score:[2,3,2] },
			{ hardpath:'/foo.txt', score:[2,3,3] },
		],
		'/foo/foo': [
			{ hardpath:'/foo/foo/foo.html', score:[2,1,1] },
			{ hardpath:'/foo/foo/foo.md', score:[2,1,2] },
			{ hardpath:'/foo/foo/foo.txt', score:[2,1,3] },
			{ hardpath:'/foo/foo/index.html', score:[2,2,1] },
			{ hardpath:'/foo/foo/index.md', score:[2,2,2] },
			{ hardpath:'/foo/foo/index.txt', score:[2,2,3] },
			{ hardpath:'/foo/foo.html', score:[2,3,1] },
			{ hardpath:'/foo/foo.md', score:[2,3,2] },
			{ hardpath:'/foo/foo.txt', score:[2,3,3] },
		],
	};

	const fileLists = [
		[
			'/foo/foo.md',
			'/foo/foo/index.txt',
			'/foo/foo/bar.html',
			'/foo/index.html',
			'/foo.md',
			'/foo.txt',
			'/index.html',
		]
	];

	const testCases = [
		{
			fuzzypath:'/foo',
			candidates: candidateLists['/foo'],
			fileList: fileLists[0],
			resolution: '/foo/foo.html',
		},
		{
			fuzzypath:'/foo/foo',
			candidates: candidateLists['/foo/foo'],
			fileList: fileLists[0],
			resolution: '/foo/foo/index.txt',
		},
		{
			fuzzypath:'/foo.md',
			candidates:[
				{ hardpath:'/foo.md', score:[1] },
			],
			fileList: fileLists[0],
			resolution: '/foo.md',
		}
	];

	return { fileLists, testCases };
}
