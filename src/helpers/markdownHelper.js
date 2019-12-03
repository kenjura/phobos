// import '../node_modules/markdown-it';
// import '../node_modules/markdown-it-container'
// import '../node_modules/markdown-it-sup'
// import '../node_modules/markdown-it-deflist'
import 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/10.0.0/markdown-it.min.js';
import 'https://cdn.jsdelivr.net/npm/markdown-it-container@2.0.0/dist/markdown-it-container.min.js';
import 'https://cdn.jsdelivr.net/npm/markdown-it-sup@1.0.0/dist/markdown-it-sup.min.js';
import 'https://cdn.jsdelivr.net/npm/markdown-it-deflist@2.0.3/dist/markdown-it-deflist.min.js';


var md = window.markdownit();

md.use(window.markdownitContainer, 'aside', getAside());
md.use(window.markdownitDeflist);
md.use(window.markdownitSup);

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