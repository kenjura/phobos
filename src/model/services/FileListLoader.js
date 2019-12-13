import FileList from '../classes/FileList.js';

import { parseFileMetadata } from '../../helpers/parseFileMetadata.js';

export { loadFileList };

async function loadFileList({ path='/', getFileList }={}) {
	if (!path) throw new Error('FileListLoader > load > requires argument "path"');
	if (!getFileList) throw new Error('FileListLoader > load > requires argument "getFileList"');

	const fileList = await getFileList();
	return fileList;
}