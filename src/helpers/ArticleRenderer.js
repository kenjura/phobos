import File from '../model/classes/File';

import { markdownToHtml } from '../helpers/markdownHelper';
import { wikiToHtml } from '../helpers/wikiHelper';

export { render }

function render(file) {
	if (!file instanceof File) throw new Error('ArticleRenderer > render > expects a "file" argument which is an instance of File class');

	const { extension, contents } = file;

	switch (extension) {
		case '.md': return markdownToHtml(contents);
		case '.txt': return wikiToHtml(contents);
		default: return '(unable to render)'
	}
}