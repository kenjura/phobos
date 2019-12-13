export { sortByScore };

function sortByScore(scores, predicate=a=>a) {
	// note: predicate is a function applied to each element to get the actual score
	console.assert(Array.isArray(scores), 'argument to sortByScore should be an array');
	// scores.forEach(score => console.assert(Array.isArray(score), 'each element in scores array should be itself an array of numbers'));

	if (scores.length < 2) return scores;

	const sorted = scores.sort((a,b) => sortScores(predicate(a), predicate(b)));

	return sorted;
}

function sortScores(a, b) {
	console.assert(Array.isArray(a), 'score > sortScores > each argument must be an array');
	console.assert(Array.isArray(b), 'score > sortScores > each argument must be an array');

	if (a[0] > b[0]) return 1;
	if (a[0] < b[0]) return -1;

	if (a.length === 1 && b.length === 1 && a[0] === b[0]) return 0;

	return sortScores(
		a.length > 1 ? a.slice(1) : [0],
		b.length > 1 ? b.slice(1) : [0],
	);
}