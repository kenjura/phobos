import path from 'path'; // magically included by Parcel

import { getExtension, getPath, getStartPath, parseFileMetadata } from './parseFileMetadata.js';
import { sortByScore } from './score.js';

export { cascadePath, getArticleCandidates, resolveArticle, resolveMenuOrStyle, scoreMenu };

// TODO: refactor so that scoreArticle / scoreMenuOrStyle are separate functions

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
		candidates.push({ hardpath:`${pathRoot}${filename}/_index.html`,       score:[2,2,1] });
		candidates.push({ hardpath:`${pathRoot}${filename}/_index.md`,         score:[2,2,2] });
		candidates.push({ hardpath:`${pathRoot}${filename}/_index.txt`,        score:[2,2,3] });
		candidates.push({ hardpath:`${pathRoot}${filename}/index.html`,       score:[2,3,1] });
		candidates.push({ hardpath:`${pathRoot}${filename}/index.md`,         score:[2,3,2] });
		candidates.push({ hardpath:`${pathRoot}${filename}/index.txt`,        score:[2,3,3] });
		candidates.push({ hardpath:`${pathRoot}${filename}/_home.html`,       score:[2,4,1] });
		candidates.push({ hardpath:`${pathRoot}${filename}/_home.md`,         score:[2,4,2] });
		candidates.push({ hardpath:`${pathRoot}${filename}/_home.txt`,        score:[2,4,3] });
		candidates.push({ hardpath:`${pathRoot}${filename}/home.html`,       score:[2,5,1] });
		candidates.push({ hardpath:`${pathRoot}${filename}/home.md`,         score:[2,5,2] });
		candidates.push({ hardpath:`${pathRoot}${filename}/home.txt`,        score:[2,5,3] });
		candidates.push({ hardpath:`${pathRoot}${filename}.html`,             score:[2,6,1] });
		candidates.push({ hardpath:`${pathRoot}${filename}.md`,               score:[2,6,2] });
		candidates.push({ hardpath:`${pathRoot}${filename}.txt`,              score:[2,6,3] });
	}
	if (type==='folder') {
		throw new Error('why is this happening? this makes no sense');
	}
	return candidates;
}


function resolveArticle({ fileList, fuzzypath }={}) {
	console.assert(Array.isArray(fileList), 'fileList should be an array');
	console.assert(typeof(fuzzypath) === 'string');

	const candidates = getArticleCandidates(fuzzypath.toLowerCase());
	const candidatesThatExist = candidates.filter(candidate => fileList.includes(candidate.hardpath));

	// console.log(fuzzypath);
	// console.log(candidatesThatExist.map(c => `\t${c.hardpath} ${c.score.join('.')}`));

	const sortedCandidates = sortByScore(candidatesThatExist, c => c.score);

	return sortedCandidates[0];
}

const EXTENSIONS = {
	ARTICLE: [ '.html', '.md', '.txt' ],
	MENU: [ '.html', '.yml', '.md', '.txt' ],
	STYLE: [ '.css', '.txt' ],
}
const FILENAMES = {
	MENU: [ '_menu', 'menu' ],
	STYLE: [ '_style', 'style', '_style.phobos', 'style.phobos' ],
}

function scoreMenu({ candidate, fuzzypath, extensions=EXTENSIONS.MENU }) {
	// console.debug({ candidate, fuzzypath, extensions });

	let score = [0,0,0];

	// priority:
	// 1 - same path
	// 2 - different path / longer is better (won't match deeper than current folder, because startPath *is* the current folder)
	// 3 - extension priority is given by order of extensions array

	const startPath = getStartPath(fuzzypath);
	const candidatePath = getStartPath(getPath(candidate));
	if (candidatePath === startPath) score[0] = -1;
	// console.debug({ candidatePath, startPath });
	score[1] = 0 - candidatePath.length; // lower is better, so we want longer paths to be lower 
	score[2] = extensions.indexOf(getExtension(candidate));

	return score;
}

function resolveMenuOrStyle({ fileList, fuzzypath, which, debug='' }={}) {
	console.assert(Array.isArray(fileList), 'fileList should be an array');
	console.assert(typeof(fuzzypath) === 'string');
	if (typeof(which) !== 'string' || !(which === 'menu' || which === 'style')) throw new Error(`resolver > resolveMenuOrStyle > argument "which" must be either 'menu' or 'style'`);

	// step 1: get candidates
	const { filename, path:mdPath, type } = parseFileMetadata(fuzzypath);
	const rootPath = '/'; // perhaps there may be a reason for this to be something else at some point, but not today
	const startPath = getStartPath(fuzzypath);
	const folders = cascadePath({ startPath, rootPath });
	const extensions = which === 'menu' ? EXTENSIONS.MENU : EXTENSIONS.STYLE;
	const filenames = which === 'menu' ? FILENAMES.MENU : FILENAMES.STYLE;
	// console.debug({ filename, mdPath, type, rootPath, startPath, folders, extensions })
	const candidates = folders.map(folder => {
		return filenames.map(filename => {
			return extensions.map(ext => {
				return path.join(folder, `${filename}${ext}`);
			})
		})
	}).flat(2);
	if (debug==='candidates') return { candidates };

	// step 1.5: filter candidates
	const fileListFlat = flattenArray(fileList.map(file => file.toLowerCase()));
	const filteredCandidates = candidates.filter(candidate => fileListFlat[candidate.toLowerCase()]);

	// step 2: score candidates
	const scoredCandidates = filteredCandidates.map(candidate => {
		return { hardpath:candidate, score:scoreMenu({ candidate, fuzzypath, extensions  }) }
	})
	if (debug==='scoredCandidates') return { candidates, filteredCandidates, scoredCandidates };
	// console.log({ candidates, filteredCandidates, scoredCandidates, fileList });

	// step 3: return sorted

	const sortedCandidates = sortByScore(scoredCandidates, c => c.score);
	return sortedCandidates[0];
}

function flattenArray(arr) {
	// flattens an array of strings
	let obj = {};
	for (let i = 0; i < arr.length; i++) {
		obj[arr[i]] = arr[i];
	}
	return obj;
}

function cascadePath({ startPath, rootPath }={}) {
	// in: { startPath='/foo/bar/baz', rootPath:'/foo/' }
	// out: [ 'bar/baz', 'bar' ]
	// assumptions: all paths are fully resolved (no ..), paths always use forward slashes

	if (!startPath || typeof(startPath) !== 'string') throw new Error('resolver > cascadePath > required argument "startPath" is missing or of invalid type.');
	if (!rootPath) rootPath = '/';

	const relevantPath = startPath.replace(rootPath,'');
	const pathParts = relevantPath.split('/');

	const paths = [];
	for (let i = 0; i < pathParts.length+1; i++) {
		paths.push(path.resolve(`${rootPath}${pathParts.slice(0,i).join('/')}`));
	}
	// console.debug({ relevantPath, startPath, rootPath, pathParts, paths })
	const uniqPaths = Array.from(new Set(paths)); // cheesy way of deduping; some use cases produce two root folders, and I'm lazy
	return uniqPaths;
}


const isChildOf = (child, parent) => { // credit https://stackoverflow.com/a/42355848
	if (child === parent) return false
	const parentTokens = parent.split('/').filter(i => i.length)
	return parentTokens.every((t, i) => child.split('/')[i] === t)
	}