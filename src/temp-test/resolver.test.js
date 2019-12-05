import { getArticleCandidates } from '/helpers/resolver.js';

const { expect } = chai; // chai isn't an ES module. the test harness loaded it globally. sigh
const { testCases } = getTestData();

describe('score', () => {
	// testCases.forEach(testCase => {
	// 	it(`scores ${first(testCase)} lower than ${last(testCase)}`, () => {
	// 		const sorted = sortByScore(testCase);
	// 		const expected = last(testCase);
	// 		const actual = last(sorted);
	// 		expect(actual).to.eql(expected);
	// 	})
	// })

	testCases.forEach(({ fuzzypath, candidates }) => {
		it(`correctly produces candidate list for ${fuzzypath}`, () => {
			const actual = getArticleCandidates(fuzzypath);
			const expected = candidates;
			expect(actual).to.eql(expected);
		});
	})
});

function first(arr) { return arr[0] };
function last(arr) { return arr[arr.length-1] };

function getTestData() {
	return {
		fuzzypaths: [
			'/foo',
			'/foo.md',
			'/foo/bar',
		],
		testCases: [
			{
				fuzzypath:'/foo',
				candidates:[
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
			},
			{
				fuzzypath:'/foo.md',
				candidates:[
					{ hardpath:'/foo.md', score:[1] },
				],
			}
		]
	}
}
