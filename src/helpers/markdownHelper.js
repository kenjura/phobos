import MarkdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container'
import markdownItSup from 'markdown-it-sup'
import markdownItDeflist from 'markdown-it-deflist'


var md = new MarkdownIt();

md.use(markdownItContainer, 'aside', getAside());
md.use(markdownItDeflist);
md.use(markdownItSup);

export { markdownToHtml }

function markdownToHtml(markdown) {
	if (typeof(markdown) !== 'string') throw new Error('markdownHelper > markdown must be a string');
	return md.render(markdown);
}



function getAside() {
	return {

		validate: function(params) {
			console.log('validate', `params="${params}"`, 'match=', params.trim().match(/^aside\s+(.*)$/));
			return true;
			return params.trim().match(/^aside\s+(.*)$/);
		},

		render: function (tokens, idx) {
			var m = tokens[idx].info.trim().match(/^aside\s+(.*)$/);

			if (tokens[idx].nesting === 1) {
				// opening tag
				// return '<aside><summary>ASIDE' + m[1] + '</summary>\n';
				return '<aside>\n';

			} else {
				// closing tag
				return '</aside>\n';
			}
		}
	}
}