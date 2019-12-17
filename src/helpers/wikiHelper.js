export { wikiToHtml }

// eww!!
const db = getDB(window.location.pathname);
const imageroot = db+'/_img/';
const instance = {};
const linkbase = `${db}/`.replace('//','/');

function getDB(pathname) {
	const match = pathname.match(/\/([^\/]+)\/?/);
	return match && match[0] || '';
}

function getMatches(string, regex, index) {
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match[index]);
    }
    return matches;
}

function wikiToHtml(wikitext, args={}) {
	let html = String(wikitext);

	problems();

	// convenience features
	// 1 - add title if none present
	// if ( !args.noH1 && !articleName.match(/^_(menu|style)/) && !html.match( /^=([^=\n]+)=/ ) && !html.match( /^__NOH1__/ ) ) html = '='+(articleName.replace(/^_/,''))+'=\n' + html;
	html = html.replace( /__NOH1__/g , '' );

	// basic formatting ------------------------------------------
	// nowiki
	html = html.replace( /<nowiki>([\d\D]*?)<\/nowiki>/g , processNoWiki );
	html = html.replace( /^ ([^\n]*)$/mg , processCodeBlock );
	html = html.replace( /<\/?[A-Za-z][^>]*>/g , processHTML );
	//html = html.replace( /{(?!\|)([^\|]+\|)?([^}]*)}/g , processJSON );
	// headers
	html = html.replace( /^===([^=\n]+)===/mg , '<h3>$1</h3>' );
	html = html.replace( /^==([^=\n]+)==/mg , '<h2>$1</h2>' );
	html = html.replace( /^=([^=\n]+)=/mg , '<h1>$1</h1>' );

	// bullets
	html = html.replace( /(\n|^)#([\d\D]*?)(\n(?!#)|$)/g , processNumberedLists );
	html = html.replace( /(\n|^)\*([\d\D]*?)(\n(?!\*)|$)/g , processBullets );


	// dd/dt
	html = html.replace( /^;([^:\n]*)\n?(?::(.*))?/gm , '<dl><dt>$1</dt><dd>$2</dd></dl>' );
	html = html.replace( /^:(.*)/m, '<dd>$1</dd>\n' );
	// hr
	html = html.replace( /---/g , '<hr>' );
	// inline
	html = html.replace( /'''''([^']+)'''''/g , '<b><i>$1</i></b>' );
	html = html.replace( /'''([^']+)'''/g , '<b>$1</b>' );
	html = html.replace( /''([^']+)''/g , '<i>$1</i>' );
	// html = html.replace( /''(.*?)''/g , '<i>$1</i>' );

	// strikethrough
	// html = html.replace( /--(.*?)--/g , '<strike>$1</strike>' );

	// embiggen
	html = html.replace( /\+\+\+([^\+]+)\+\+\+/g , '<span style="font-size: 200%;">$1</span>' );
	html = html.replace( /\+\+([^\+]+)\+\+/g , '<span style="font-size: 150%;">$1</span>' );
	// tables
	html = html.replace( /\{\|([\d\D]*?)\|\}/g , processTable );
	// div/indent
	html = html.replace( /^\.\.\.(.*)$/mg , '<div class="indent2">$1</div>' );
	html = html.replace( /^\.\.(.*)$/mg , '<div class="indent1">$1</div>' );
	html = html.replace( /^\.(.*)$/mg , '<div>$1</div>' );
	// links
	html = html.replace( /\[\[([^\[\]\|#]*)(?:(\|[^\]\|#]*)+)?(?:#([^\]\|#]*))?\]\]/g , processLink );
	html = html.replace( /\[\[([^\[\]\|#\n]*)((\|[^\]\|#\n]*)+)?(?:#([^\]\|#\n]*))?\]\]/g , processLink );
	html = html.replace( /\[([^\]\n ]*)(?: ([^\]\n]+))?\]/g , processExternalLink );

	// code
	// html = html.replace( /^ (.*)$/mg , '<code>$1</code>' );
	// paragraphs
	html = html.trim();
	// html = html.replace( /^.*$/gm , processParagraphs );
	html = html.replace( /^[^\$\n].*$/gm , processParagraphs );
	html = html.replace( /<p><\/p>/g , '' );
	// beautify HTML
	//html = beautifyHTML(html);

	// superscript
	html = html.replace( /\^([^\^]*)\^/g , '<sup>$1</sup>' );

	// restore nowiki blocks
	html = html.replace( /\$NOWIKI_(\d*)\$/g , processNoWikiRestore );
	html = html.replace( /\$CODE_(\d*)\$/g , processCodeBlockRestore );
	html = html.replace( /<\/code>\s*<code>/g , '\n' );
	html = html.replace( /\$HTML_(\d*)\$/g , processHTMLRestore );
	//html = html.replace( /\$JSON_(\d*)\$/g , processJSONRestore );

	return html;
}

function problems() {
	console.debug(`wikiHelper > problems > autoH1 doesn't work because we don't know the article name.`)
	console.debug(`wikiHelper > problems > links aren't rendering right due to lack of linkbase.`)
}


	function processLink(entireMatch,articleName,displayName,anchor) {
		var namespace = [].concat(articleName.match( /([^:]+)(?=:)/g )).pop();
		if (namespace) var res = processSpecialLink(entireMatch,namespace,articleName,displayName);
		if (res) return res;
		if (!anchor) anchor = '';

		if (articleName.match(/^(\d+d\d+)([+-]\d+)/)) return '<a onclick="roll(\''+articleName+'\')">'+articleName+'</a>';
		if (articleName.match(/^[+-]/)) return '<a onclick="roll('+articleName+')">'+articleName+'</a>';

		// if (isNullOrEmpty(articleName)) return '<a href="#'+anchor+'" onclick="instance.findHeader(\''+anchor+'\')">'+anchor+'</a>';
		if (!articleName) return '<a data-scroll href="#'+anchor.replace( /\s/g, '_' )+'">'+anchor+'</a>';

		if (!displayName) displayName = anchor || articleName;
		else if (displayName.substr(0,1)=='|') displayName = displayName.substr(1);

		if (!anchor) anchor = ''; else anchor = '#'+anchor;

		var active = false;

		// active = allArticles.some(function(a){ return a==articleName });

		// var link = linkbase+articleName+anchor;
		var link = linkbase+articleName+anchor;

		if (articleName.indexOf('/')>-1) {
			link = '/'+articleName+anchor;
			displayName = articleName.substr(articleName.indexOf('/')+1);
			console.log('link=',link);
		}

		return '<a class="wikiLink '+(active?'active':'inactive')+'" data-articleName="'+articleName+'" href="'+link+'">'+displayName+'</a>';
	};

	function processNumberedLists(entireMatch) {
		var lines = entireMatch.match( /^(.*)$/gm );
		var level = 1;
		var html = '\n<ol>';
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			if (line.substr(0,1)!='#') continue;
			var lineLevel = line.match( /#+/ )[0].length;
			if (lineLevel > level) html += _.stringRepeat('<ol>',lineLevel-level);
			if (lineLevel < level) html += _.stringRepeat('</li></ol>',level-lineLevel);
			if (lineLevel == level && html != '\n<ol>') html += '</li>';
			level = lineLevel;
			//html += '\n'+_.stringRepeat('\t',lineLevel);
			html += '<li>'+line.replace( /#+/ , '');
		}

		if (level > 1) html += _.stringRepeat('</li></ol>',level);
		html += '</li></ol>\n';
		return html;
	};

	function processBullets(entireMatch) {
		var lines = entireMatch.match( /^(.*)$/gm );
		var level = 1;
		var html = '\n<ul>';
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			if (line.substr(0,1)!='*') continue;
			var lineLevel = line.match( /\*+/ )[0].length;
			if (lineLevel > level) html += '<ul>'.repeat(lineLevel-level);
			if (lineLevel < level) html += '</li></ul>'.repeat(level-lineLevel);
			if (lineLevel == level && html != '\n<ul>') html += '</li>';
			level = lineLevel;
			//html += '\n'+_.stringRepeat('\t',lineLevel);
			html += '<li>'+line.replace( /\*+/ , '');
		}

		if (level > 1) html += '</li></ul>'.repeat(level);
		html += '</li></ul>\n';
		return html;
	};
	function processExternalLink(entireMatch,url,displayName) {
		if (!(displayName)) displayName = url;
		return '<a href="'+url+'">'+displayName+'</a>';
	};
	function processSpecialLink(entireMatch,namespace,articleName,displayName) {
		var args = [];
		if (!(displayName)) displayName = '';
		else {
			args = getMatches( entireMatch, /\|([^\|\]]+)/g, 0 );
			// var str = [].concat(entireMatch.match( /\[\[([^\]]+)\]\]/ )).pop();
			// if (str) args = str.split('|');
		}

		articleName = articleName.replace( namespace+':' , '' );

		function getArg(index) {
			if (args.length >= index) return args[index];
			else return '';
		}

		switch (namespace.toUpperCase()) {
			case 'IFRAME': return '<iframe src="'+articleName+'"'+getArg(0)+'></iframe>';
			case 'IMAGE': return getImageTag({name:articleName,args:args,imgUrl:imageroot+articleName});
			default:
				return null;
		}
	};

	function processJSON(entireMatch,options,tag) {
		if (!instance._JSONTags) instance._JSONTags = [];
		instance._JSONTags.push( new JSONTag({options:options,body:'{'+tag+'}'}) );
		return '$JSON_'+(instance._JSONTags.length-1)+'$';
	};
	function processJSONRestore(entireMatch,arrayIndex) {
		var tag = instance._JSONTags[parseInt(arrayIndex)];
		return 'JSON tag: '+tag.render();
	};
	function processHTML(entireMatch) {
		if (!instance._htmlTags) instance._htmlTags = [];
		instance._htmlTags.push(entireMatch);
		return '$HTML_'+(instance._htmlTags.length-1)+'$';
	};
	function processHTMLRestore(entireMatch,arrayIndex) {
		return instance._htmlTags[parseInt(arrayIndex)];
	};
	function processNoWiki(entireMatch,wikiText) {
		if (!instance._noWiki) instance._noWiki = [];
		instance._noWiki.push(wikiText);
		return '$NOWIKI_'+(instance._noWiki.length-1)+'$';
	};
	function processNoWikiRestore(entireMatch,arrayIndex) {
		return instance._noWiki[parseInt(arrayIndex)];
	};
	function processCodeBlock(entireMatch,wikiText) {
		if (!instance._CodeBlock) instance._CodeBlock = [];
		instance._CodeBlock.push(wikiText);
		return '$CODE_'+(instance._CodeBlock.length-1)+'$';
	};
	function processCodeBlockRestore(entireMatch,arrayIndex) {
		return '<code>'+instance._CodeBlock[parseInt(arrayIndex)]+'</code>';
	};
	function processParagraphs(entireMatch) {
		if (entireMatch.substr(0,1)=='<') return entireMatch; // html? looks like it's already been converted, let's leave it alone
		if (entireMatch.indexOf('$HTML')>-1) return entireMatch;

		return '<p>'+entireMatch+'</p>';
	};

	function processTable(entireMatch,tableBody) {

		// ***************** LEX ***************
		// protect pipe characters inside a table that have nothing to do with cell boundaries
		entireMatch = entireMatch.replace( /\[\[[^\]\n]+\]\]/g , function(em) {
			return em.replace( /\|/g , '$BAR$' );
		});

		// table boundaries
		entireMatch = entireMatch.replace( /\{\|(?:([^>\n]*)>)?/g , '¦TABLE¦$1¦' );
		entireMatch = entireMatch.replace( /\|\}/g , '¦END TABLE¦' );

		// table rows
		entireMatch = entireMatch.replace( /^\|-/mg , '¦ROW BOUNDARY¦' );

		// table headers

		// note 2013-04-02: tweaked TH regex to allow ! characters inside TD cells. Basically, a single ! is only a "start TH" if it is preceded by a newline.
		// note 2014-06-19: swapped out $ for \n inside the TH/TD optional HTML attributes section. In a character class, $ doesn't mean "end of line", it's always literal. For some reason.

		//entireMatch = entireMatch.replace( /!{1,2}(?:([^$>\|!]+)>|([0-9]+)\|)?([^!\|¦]+)(?=\n!|!!|\n\||\|\||¦)/gm , function(wholeMatch,m0,m1,m2,m3,m4,m5) {
		entireMatch = entireMatch.replace( /(?:^!|!!)(?:([^\n>\|!]+)>|([0-9]+)\|)?([^!\|¦]+)(?=\n!|!!|\n\||\|\||¦)/gm , function(wholeMatch,m0,m1,m2,m3,m4,m5) {
			m0 = m0 || '';
			m2 = m2 || '';
			if (m1!=''&&typeof(m1)!='undefined') return '¦TH¦colspan="'+m1+'" '+m0+'¦'+m2+'¦END TH¦';
			else return '¦TH¦'+m0+'¦'+m2+'¦END TH¦';
			// m0 = !m0>
			// m1 = !m1| aka colspan
			// m2 = actual cell content
		} );
		//return entireMatch;
		entireMatch = entireMatch.replace( /\|{1,2}(?:([^\n>\|!]+)>|([0-9]+)\|)?([^\|¦]+)(?=\n!|!!|\n\||\|\||¦)/gm , function(wholeMatch,m0,m1,m2,m3) {
			m0 = m0 || '';
			m2 = m2 || '';
			if (m1!=''&&typeof(m1)!='undefined') return '¦TD¦colspan="'+m1+'" '+m0+'¦'+m2+'¦END TD¦';
			else return '¦TD¦'+m0+'¦'+m2+'¦END TD¦';
		} );


		// ***************** FINAL ******************
		entireMatch = entireMatch.replace( /¦TABLE¦([^¦]*)¦/g , "<div class=\"tableContainer\"><table $1><tr>" );
		entireMatch = entireMatch.replace( /¦END TABLE¦/g , "</tr></table></div>" );

		entireMatch = entireMatch.replace( /¦ROW BOUNDARY¦/g , "</tr><tr>" );

		entireMatch = entireMatch.replace( /¦TH¦([^¦]*)¦([^¦]*)¦END TH¦/g , "<th $1>$2</th>" );
		entireMatch = entireMatch.replace( /¦TD¦([^¦]*)¦([^¦]*)¦END TD¦/g , function(wholeMatch,m0,m1,m2) {
			return '<td '+(m0||'')+'>\n'+(m1||'')+'\n</td>';
		});

		entireMatch = entireMatch.replace( /\$BAR\$/g , '|' );

		// **************** RETURN *****************
		return entireMatch;
	};


function getImageTag(args) {
	if (!args) args = {};
	if (!args.name) { console.error('WikiImage.getImage > cannot get image with no name.'); return ''; }
	// if (!args.article) { console.error('WikiImage.getImage > article not supplied.'); return ''; }
	
	// var images = args.article.images;
	// var image = null;
	// if (images) {
	// 	for (var i = 0; i < images.length; i++) {
	// 		if ( images[i].name == args.name ) {
	// 			image = images[i];
	// 			break;
	// 		}
	// 	}
	// }
	// if (!image) {
	// 	// image not yet uploaded
	// 	return '<div class="noImage" ng-click="activateImage(\''+args.name+'\')">?</div>';
	// } else {
		// path
		// var imgUrl = WikiImage.imageRoot + image.path;		
		var imgUrl = args.imgUrl;		
		// style
		var width = 'auto', height = 'auto', classes = '', caption = '', fillMode = null, float = '';
		if (args.args&&args.args.length) {
			for (var i = 0; i < args.args.length; i++) {
				var arg = args.args[i];
				// numbers = width/height. for now, let's just do width
				if (!isNaN(arg)) { 
					if (width=='auto') width = parseFloat(arg) + 'px'; 
					else height = parseFloat(arg) + 'px';
					continue; 
				}
				if (arg.substr(-1)=='%') { 
					if (width=='auto') width = arg; 
					else height = arg;
					continue; 
				}
				if (arg.substr(-2)=='px') { 
					if (width=='auto') width = arg; 
					else height = arg;
					continue; 
				}
				// string values might mean something...
				if (arg=='right') { float = 'float: right; clear: right;'; continue; }
				if (arg=='fit'||arg=='box') { classes += arg + ' '; continue; }
				if (arg=='center') { classes += 'center '; continue; }
				if (arg=='cover'||arg=='contain') { fillMode = arg; continue; }
				// else, assume it's the caption
				caption = arg;
			}
		}		
		var style = 'width: '+width+'; height: '+height+';' + float;
		
		// events		
		// var events = 'onclick="_scope.activateImage(\''+args.name+'\',\''+imgUrl+'\')"';	
		var events = 'ng-click="activateImage(\''+args.name+'\',\''+imgUrl+'\')"';
		
		//return '<img class="wikiImage" src="'+imgUrl+'" style="'+style+'" '+events+' />';

		var template = ''+
		'<a href="{src}">'+
			'<div class="wikiImage {class}" style="{style}" title="{caption}">'+
				'<img src="{src}" {events} />'+
				'<div class="wikiImage_caption">{caption}</div>'+
			'</div>'+
		'</a>';

		var template2 = ''+
		'<a href="{src}">'+
			'<div class="wikiImage {class}" style="background: url(\'{src}\'); background-size: {fillMode}; {style}" {events}>'+
				'<div class="wikiImage_caption">{caption}</div>'+
			'</div>'+
		'</a>';


		var html = template;
		if (fillMode) html = template2;

		html = html.replace( /\{src\}/g , imgUrl );
		html = html.replace( '{class}' , classes );
		html = html.replace( '{style}' , style );
		html = html.replace( '{events}' , events );
		html = html.replace( /\{caption\}/g , caption );
		if (fillMode)
			html = html.replace( '{fillMode}' , fillMode );

		return html;
	// }
	
	/*
	var imgCache = localStorage.getItem('imageCache');
	if (!imgCache) imgCache = JSON.stringify({});
	
	try {
		imgCache = JSON.parse(imgCache);
		var imgUrl = imgCache[args.name];
		if (!imgUrl) {
			//var img = new WikiImage(args);
			var img = new WikiImage(args);
			var tag = img.render();
			imgCache[args.name] = img.url;						
		} else {
			args.url = imgUrl;			
			var img = new WikiImage(args);			
			var tag = img.render();
		}
		localStorage.setItem('imageCache',JSON.stringify(imgCache));
		return tag;
	} catch(e) {
		error('WikiImage.getImage > could not retrieve or parse the image cache. error to follow.');
		error(e);
		return new WikiImage(args);
	}
	*/

	
}




/* how images should work:
* when you load an article, you also get a list of all images used in that article, and their URLs
* when rendering an image, check that list first. if the image name isn't in that list, don't bother trying to load the image
** if it is in the list, load it, relying on browser cache to reduce load
** important: do not use the server method to find each image's url; get them all from the loadArticle call
** the FS db option should store image (and link) data in a special section at the end of the article body. it also doesn't allow images to have a different name than their url
* when an image is not yet uploaded, show a gray box with a question mark
* when the grey box or the image is clicked, pop up the image upload modal
* the image upload modal uses the appropriate service endpoint to upload, then returns the new URL
** the new URL is then cached
** the image is loaded from the URL
** the image is associated with the article, which is immediately saved with the new image association
*/