import { getFile } from './file.js';

export { getArticle };

async function getArticle(args={}) {
	const { articlePath, getFile=getFile } = args;
	assert(articlePath);
	assert(getFile);


}