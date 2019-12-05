import { parseFileMetadata } from '/helpers/parseFileMetadata.js';

export { getArticleCandidates, resolveArticle };

function getArticleCandidates(fuzzypath) {
	const { extension, filename, path, type } = parseFileMetadata(fuzzypath);

	let pathRoot = `${path}/`.replace(/\/\//g, '/');

	// console.log(fuzzypath, { extension, filename, path, type });

	const candidates = [];

	if (type==='file' && extension) candidates.push({ hardpath:fuzzypath, score:[1] });
	if (type==='ambiguous') {
		candidates.push({ hardpath:`${pathRoot}${filename}/${filename}.html`, score:[2,1,1] });
		candidates.push({ hardpath:`${pathRoot}${filename}/${filename}.md`,   score:[2,1,2] });
		candidates.push({ hardpath:`${pathRoot}${filename}/${filename}.txt`,  score:[2,1,3] });
		candidates.push({ hardpath:`${pathRoot}${filename}/index.html`,       score:[2,2,1] });
		candidates.push({ hardpath:`${pathRoot}${filename}/index.md`,         score:[2,2,2] });
		candidates.push({ hardpath:`${pathRoot}${filename}/index.txt`,        score:[2,2,3] });
		candidates.push({ hardpath:`${pathRoot}${filename}.html`,             score:[2,3,1] });
		candidates.push({ hardpath:`${pathRoot}${filename}.md`,               score:[2,3,2] });
		candidates.push({ hardpath:`${pathRoot}${filename}.txt`,              score:[2,3,3] });
	}
	if (type==='folder') {
		throw new Error('why is this happening? this makes no sense');
	}
	return candidates;
}

/*
scores:

*/

function resolveArticle(fuzzypath) {

}