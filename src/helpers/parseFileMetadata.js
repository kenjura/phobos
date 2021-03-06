import { titleCase } from "title-case";

export { getExtension, getFilename, getPath, getStartPath, getTitle, getType, parseFileMetadata };

const KNOWN_EXTENSIONS = [ '.md', '.txt', '.css', '.html', '.yml' ];

function parseFileMetadata(filepath) {
	// var filename = fullPath.replace(/^.*[\\\/]/, '')
	// return str.split('\\').pop().split('/').pop();

	const extension = getExtension(filepath);
	const filename = getFilename(filepath);
	const path = getPath(filepath);
	const title = getTitle(filepath);
	const type = getType(filepath);

	return { extension, filename, path, title, type };
}


function getExtension(filepath='') {
	const extIndex = filepath.lastIndexOf('.');
	if (extIndex === -1) return null;
	const ext = filepath.substr(extIndex);
	return KNOWN_EXTENSIONS.includes(ext) ? ext : null;
}

function getFilename(filepath='') {
	return filepath.substr(filepath.lastIndexOf('/')+1) || null;
}

function getPath(filepath='') {
	const i = filepath.lastIndexOf('/');
	if (i > 0) return filepath.substr(0, i) || null;
	if (i === 0) return '/';
	if (i === -1) return '.';
}

function getStartPath(filepath) {
	// /foo || /foo/ => /foo/
	// useful for starting points for cascading down folder structure
	// when you don't know if /foo is a file or folder

	const { filename, path, type } = parseFileMetadata(filepath);
	// console.debug({ filepath, filename, path, type });
	const startPath = type === 'file' && path 
		|| type === 'folder' && `${path}/` 
		|| type === 'ambiguous' && `${ensureTrailingSlash(path)}${filename}/`;
	return startPath.replace(/\/\//g, '/'); // cheesy hack for folder "/" returning "//"
}

function ensureTrailingSlash(filepath) {
	return filepath.substr(-1) === '/' ? filepath : `${filepath}/`;
}

function getTitle(filepath) {
	const filename = getFilename(filepath) || '';
	return titleCase(filename);
}

function getType(filepath='') {
	const ext = getExtension(filepath);

	if (ext && KNOWN_EXTENSIONS.includes(ext)) return 'file';
	if (filepath.substr(-1) === '/') return 'folder';
	else return 'ambiguous';
}