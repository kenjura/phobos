import { get, set } from '/helpers/cache.js';
import { Router } from 'https://unpkg.com/@vaadin/router';

// NOTE: window.Dropbox is magically inserted via Dropbox SDK. sigh...

export { getFileList, getFileContents, getLogin, ingestAccessToken, isAuthenticated }


const CONFIG = { // todo: this should be server-side and proxied!
	CLIENT_ID: 's4jxaurwyqdw6jq',
	ROOT_PATH: '/RPG Root/RPG/wiki',
}

function ingestAccessToken() {
	const token = getAccessTokenFromUrl();
	localStorage.setItem('accessToken', token);
}

function getAccessTokenFromUrl() {
	return window.location.hash.substr(1).split('&').filter(a => a.match('access_token'))[0].substr(13);
}

async function getDropbox() {
	if (isAuthenticated()) {
		return new Dropbox.Dropbox({ accessToken: localStorage.getItem('accessToken') });
	} else {
		window.history.pushState({ returnUrl:window.location.href }, 'Phobos > log in to dropbox', '/login');
	} 
}

async function getFileContents(articlePath) {
	if (get(articlePath)) return get(articlePath);
	const dropbox = await getDropbox();
	const path = await resolve(articlePath);
	const content = await getFileByPath({ dropbox, path });
	set(articlePath, content);
	return content;
}

async function getFileList() {
	
}

async function getLogin({ returnUrl='http://localhost:8080/login/success' }={}) {
	const dbx = new Dropbox.Dropbox({ clientId: CONFIG.CLIENT_ID });
	const authUrl = dbx.getAuthenticationUrl(returnUrl);
	return authUrl;
}

function isAuthenticated() {
	// return window.location.hash.match('access_token');
	return localStorage.getItem('accessToken');
}


async function getFileByPath({ dropbox, path }) {
	if (!dropbox) throw new Error('dropbox service > getFileByPath > initialized dropbox instance must be supplied.');

	// assuming path has been fully resolved. TODO: check this here

	// debug(`getFileByPath > attempting. db="${db}", articlePath="${articlePath}"`);

	// check if the path is already a valid file or folder
	let type;
	try {
		const metadata = await dropbox.filesGetMetadata({ path });
		type = metadata['.tag'];
	} catch(err) {
		if (!err.error) throw err;
		if (err.error && !err.error.error_summary.includes('path/not_found/')) throw err;
		type = 'not_found';
	}
	if (type === 'file') return await getFile({ dropbox, path }); 
	if (type === 'folder') return await getIndex({ dropbox, path });
	if (type === 'not_found') return await searchForFile({ dropbox, path });

	return null;
	// match 2: file matching path with .html, .txt, or .md added
	// if path is a folder, use search with path as path, and query is _home or index
	// if error in metadata, use search with parent path as path, and query is path.substr(path.lastIndexOf('/'))
	// if path is a file, you're done, jsut download it


	// match 3: file matching path with /(_home|index).(html|txt|md)

	async function getFile({ dropbox, path }) {
		const response = await dropbox.filesDownload({ path });
		const fileContent = await readBlob(response.fileBlob);
		return fileContent
	}
	async function getIndex({ dropbox, path }) {
		const indexPaths = await search({ dropbox, path, query:'index' });
		if (indexPaths !== null) return await chooseAndDownload({ dropbox, paths:indexPaths });

		const homePaths = await search({ dropbox, path, query:'_home' });
		if (homePaths !== null) return await chooseAndDownload({ dropbox, paths:homePaths });
	}
	async function chooseAndDownload({ dropbox, paths }) {
		const path = choose(paths);
		if (!path) return null;

		const content = await getFile({ dropbox, path });
		const extension = path.substr(path.lastIndexOf('.')+1);

		return { extension, content };

		function choose(arr) {
			return arr.find(a => a.match('.html')) 
				|| arr.find(a => a.match('.md')) 
				|| arr.find(a => a.match('.css')) 
				|| arr.find(a => a.match('.txt')) 
				|| null;
		}
	}
	async function search({ dropbox, path, query }) {
		const result = await dropbox.filesSearch({ path, query });

		if (Array.isArray(result.matches) && result.matches.length === 0 && !result.more) return null;

		const matches = result.matches
			.map(match => match.metadata.path_lower)
			.filter(p => p.match(`${path.toLowerCase()}/${query.toLowerCase()}`.replace(/\/\//g,'/'))); // catches a rare case where there are no matches in this folder, but there are matches in a subfolder, which should be excluded

		return matches.length ? matches : null;
	}
	async function searchForFile({ dropbox, path }) {
		const query = path.substr(path.lastIndexOf('/') + 1); // TODO: account for paths in the form /foo/bar/baz/ (trailing slash falsely indicating folder when really baz is a file) (not sure if this ever happens)
		const paths = await search({
			dropbox,
			path: path.replace(query, ''),
			query,
		});
		if (paths === null) return null;
		return await chooseAndDownload({ dropbox, paths });
	}


}

function readBlob(blob) {
	// var reader = new FileReader();
	//    reader.addEventListener("loadend", () => return reader.result);
	//    reader.readAsText(blob);
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('loadend', () => resolve(reader.result));
		reader.readAsText(blob);
	});
}

async function resolve(articlePath) {
	const partialPath = `${CONFIG.ROOT_PATH}${articlePath}`;

	// TODO: handle index, etc

	return partialPath;
	
}