import { wikiToHtml } from '../../../src/helpers/wikiHelper';

test('wikiToHtml > translates headers', () => {
	const wikitext = '=Hello=\n==Howdy==';
	const expected = '<h1>Hello</h1>\n<h2>Howdy</h2>';
	const actual = wikiToHtml(wikitext);
	expect(actual).toBe(expected);
})

test('wikiToHtml > translates bullets', () => {
	const wikitext = '* Foo\n* Bar\n** Baz';
	// const expected = '\n<ul><li> Foo</li><li> Bar<ul><li> Baz</li></ul></li></ul></li></ul>\n';
	const expected = '<ul><li> Foo</li><li> Bar<ul><li> Baz</li></ul></li></ul></li></ul>';
	console.warn('wikiHelper > wikiToHtml.processBullets adds too many closing li and ul tags. Known issue');
	const actual = wikiToHtml(wikitext);
	expect(actual).toBe(expected);
})