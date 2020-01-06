import File from '../model/classes/File';

import { markdownToHtml } from '../helpers/markdownHelper';
import { wikiToHtml } from '../helpers/wikiHelper';

export { render, sectionify }

function render(file) {
	if (!(file instanceof File)) throw new Error('ArticleRenderer > render > expects a "file" argument which is an instance of File class');

	const { extension, contents } = file;

	switch (extension) {
		case '.md': return markdownToHtml(contents);
		case '.txt': return wikiToHtml(contents);
		default: return '(unable to render)'
	}
}



function fileListIfy(node) {
	const links = node.querySelectorAll('a');
	const activeLinks = links.filter(link => fileList.includes(link.getAttribute('href').toLowerCase()));
	activeLinks.forEach(link => link.setAttribute('active','true'));
}

function sectionify(innerHTML) {
	const node = document.createElement('div');
	node.innerHTML = innerHTML;

	sectionifyNode(node);

	return node.innerHTML;
}

function sectionifyNode(node) {
	if (node.querySelectorAll('.sectionOuter').length > 0) return;
	const elements = node.children;
	let asides = [];
	let sections = [];
	let currentSection;
	for (let i = 0; i < elements.length; i++) {
		let element = elements[i].cloneNode(true);
		if (!currentSection) currentSection = new DocumentFragment();
		if (element.tagName === 'ASIDE') {
			asides.push(element);
			continue;
		};		
		if (element.tagName === 'H1' && currentSection.children.length > 0) {
			sections.push(currentSection);
			currentSection = new DocumentFragment();
			currentSection.append(element);
		} else {
			currentSection.append(element);
		}
		if (i === elements.length - 1) {
			sections.push(currentSection);
			currentSection = null;
		}
	};
	sections.forEach(section => {
		let inner = document.createElement('section');
		inner.className = 'section';
		let h1 = section.childNodes[0].nodeName === 'H1' ? section.childNodes[0] : null;
		if (h1) section.removeChild(h1);
		while (section.childNodes.length) { 
			inner.appendChild(section.firstChild); 
		}
		if (h1) section.prepend(h1);
		section.appendChild(inner);
	});
	node.innerHTML = '';
	asides.forEach(aside => node.appendChild(aside));
	sections.forEach(section => {
		let element = document.createElement('section');
		element.className = 'sectionOuter';
		element.append(section);
		// section.forEach(e => element.appendChild(e));
		node.appendChild(element);
	});
	node.querySelectorAll('h1,h2,h3').forEach(header => header.setAttribute('id',header.innerText));

	return node;
}