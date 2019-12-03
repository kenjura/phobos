import '../node_moduels/markdown-it';
import '../node_modules/markdown-it-container'
import '../node_modules/markdown-it-sup'
import '../node_modules/markdown-it-deflist'


var md = window.markdownit();

// const md = markdown({ html:true });
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