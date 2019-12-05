export { getExtension, getFilename, getPath, getType, parseFileMetadata };

function parseFileMetadata(filepath) {
	// var filename = fullPath.replace(/^.*[\\\/]/, '')
	// return str.split('\\').pop().split('/').pop();

	const extension = getExtension(filepath);
	const filename = getFilename(filepath);
	const path = getPath(filepath);
	const type = getType(filepath);

	return { extension, filepath, path, type };
}


function getExtension(filepath) {
	const extIndex = filepath.lastIndexOf('.');
	if (extIndex === -1) return null;
	else return filepath.substr(extIndex);
}

function getFilename(filepath) {
	return filepath.substr(filepath.lastIndexOf('/')+1) || null;
}

function getPath(filepath) {
	const i = filepath.lastIndexOf('/');
	if (i > 0) return filepath.substr(0, i) || null;
	if (i === 0) return '/';
	if (i === -1) return '.';
}

function getType(filepath) {
	const ext = getExtension(filepath);

	if (ext) return 'file';
	if (filepath.substr(-1) === '/') return 'folder';
	else return 'ambiguous';
}