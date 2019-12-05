import File from '/model/classes/File.js';
import FileList from '/model/classes/FileList.js';

import { parseFileMetadata } from '/helpers/parseFileMetadata.js';

export { load, resolveArticle };

async function load(args={}) {
	console.assert(args.file instanceof File, 'args.file is not an instance of File');
	console.assert(args.fileList instanceof FileList, 'args.fileList is not an instance of FileList');


	return new File(dummyData.files[0]);
}

function resolveArticle(args={}) {
	const { fuzzypath, fileList } = args;
	console.assert(typeof(fuzzypath) === 'string', 'args.fuzzypath is not an instance of String');
	console.assert(fileList instanceof FileList, 'args.fileList is not an instance of FileList');

	const { extension, filename, path, type } = parseFileMetadata(fuzzypath);

	const possibleMatches = fileList.filter(hardpath => hardpath.match(new RegExp(`^${fuzzypath}`)));
	const scoredMatches = possibleMatches.map(match => {
		let score = 0;

		const parsed = parseFileMetadata(match);
		const ext = parsed.extension;
		const fn = parsed.filename;
		const p = parsed.path;
		const t = parsed.type;

		if (match === fuzzypath) score += 10000;
		if (ext === extension) score += 1000;
		if (fn === filename) score += 100;
		if (p === path) score += 10;

		return {
			match,
			score
		}
	})

	console.log(scoredMatches);
	return scoredMatches;
}



const dummyData = {
	files: [
		{ fuzzypath:'/foo/bar', hardpath:'/foo/bar.md', extension:'.md', type:'file', path:'/foo', loaded:false, contents:null },
	]
}