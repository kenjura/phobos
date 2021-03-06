import FileList from '../classes/FileList.js';

import { getFileList as _getFileList } from './dropbox';
import { parseFileMetadata } from '../../helpers/parseFileMetadata.js';
import { memoize } from '../../helpers/memoize';

export { loadFileList, treeFrom };

async function _loadFileList({ getFileList=_getFileList }={}) {
	const fileList = await getFileList();
	return fileList;
}

function treeFrom({ fileList, keys={}, transformFn=a=>a }) {
	if (!fileList || !Array.isArray(fileList)) throw new Error('FileListLoader > treeFrom > argument "fileList" is missing or in an invalid format');

	// is there a better way to do this?
	if (!Object.keys(keys).length) {
		keys.children = 'children';
		keys.parent = 'parent';
		keys.path = 'path';
	}

	const tree = Array.from(fileList)
		.map(path => ({
			[keys.children]: [],
			[keys.parent]: path.substring(0, path.lastIndexOf('/')) || null,
			[keys.path]: path,
		}));
	tree.forEach(obj => {
			obj[keys.children] = tree.filter(t => t[keys.parent] === obj[keys.path]);
		});
	tree.forEach(transformFn);
	const finalTree = tree.filter(t => t[keys.parent] === null);

	return finalTree;
}

const loadFileList = memoize(_loadFileList);