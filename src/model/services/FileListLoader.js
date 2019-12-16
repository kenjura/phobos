import FileList from '../classes/FileList.js';

import { parseFileMetadata } from '../../helpers/parseFileMetadata.js';
import { memoize } from '../../helpers/memoize';

export { loadFileList };

async function _loadFileList({ path='/', getFileList }={}) {
	if (!path) throw new Error('FileListLoader > load > requires argument "path"');
	if (!getFileList) throw new Error('FileListLoader > load > requires argument "getFileList"');

	const fileList = await getFileList();
	return fileList;
}

const loadFileList = memoize(_loadFileList);