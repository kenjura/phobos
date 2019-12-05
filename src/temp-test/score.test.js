import { sortByScore } from '/helpers/score.js';

const { expect } = chai; // chai isn't an ES module. the test harness loaded it globally. sigh
const { testCases } = getTestData();

describe('score', () => {
	testCases.forEach(testCase => {
		it(`scores ${first(testCase)} lower than ${last(testCase)}`, () => {
			const sorted = sortByScore(testCase);
			const expected = last(testCase);
			const actual = last(sorted);
			expect(actual).to.eql(expected);
		})
	})

	it('knows how to use a predicate function', () => {
		const arr = [ {score:[1]}, {score:[3]}, {score:[2]} ];
		const predicate = obj => obj.score;
		const actual = sortByScore(arr, predicate);
		const expected = [ {score:[1]}, {score:[2]}, {score:[3]} ];
		expect(actual).to.eql(expected);
	})
});

function first(arr) { return arr[0] };
function last(arr) { return arr[arr.length-1] };

function getTestData() {
	return {
		testCases: [
			[ [1,0,0], [2,0,1], [1,1,2], [1,0,1]   ],
			[ [1,0,0], [1,0,1]   ],
			[ [1,0,0], [1,0,0,1] ],
			[ [1,0],   [1,1,0,1] ],
			[ [1,0,1], [1,0]     ],
			[ [1,0,0], [1,0]     ],
			[ [1,0,0], [1,1,0]   ],
			[ [1,0,0], [1,1,1]   ],
			[ [1,0,0], [1,1]     ],
			[ [1,0,0], [1,2]     ],
			[ [1,0,0], [2]       ],
			[ [1,0,0], [2,0]     ],
			[ [1,0,0], [2,0,0]   ],
			[ [1,0,0], [2,0,0], [3,0,0] ],
		]
	}
}
