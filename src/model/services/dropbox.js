import { Dropbox } from 'dropbox';
import { get, set } from '../../helpers/cache.js';

export { downloadFile, getDropbox, getFileList, getLogin, ingestAccessToken, isAuthenticated };


const CONFIG = { // todo: this should be server-side and proxied!
	CLIENT_ID: 's4jxaurwyqdw6jq',
	ROOT_PATH: '/RPG Root/RPG/wiki',
	MAX_SEQUENTIAL_REQUESTS: 10,
}

async function downloadFile({ dropbox=getDropbox(), hardpath }) {
	const cacheKey = `file: ${hardpath}`;
	// if (get(cacheKey)) return get(cacheKey);
	console.warn('dropbox > downloadFile > cache get temporarily disabled!!!');
	const path = `${CONFIG.ROOT_PATH}/${hardpath}`.replace(/\/\//g, '/');
	const response = await dropbox.filesDownload({ path });
	const fileContent = await readBlob(response.fileBlob);
	set(cacheKey, fileContent);
	return fileContent;
}

async function getLogin({ returnUrl='http://localhost:8080/login/success' }={}) {
	const dbx = new Dropbox({ clientId: CONFIG.CLIENT_ID });
	const authUrl = dbx.getAuthenticationUrl(returnUrl);
	return authUrl;
}

function getDropbox() {
	if (isAuthenticated()) {
		return new Dropbox({ accessToken: localStorage.getItem('accessToken') });
	} else {
		window.history.pushState({ returnUrl:window.location.href }, 'Phobos > log in to dropbox', '/login');
	} 
}


async function getFileList(args={}) {
	const cacheKey = `file-list`;
	if (get(cacheKey) && !args.noCache) return get(cacheKey);

	const dropbox = args.dropbox || getDropbox();
	if (!dropbox) throw new Error('dropbox > getFileList > not authenticated!');

	const path = CONFIG.ROOT_PATH;
	const recursive = true;

	// debug(`getFileList > attempting to load file list`);

	let cursor, has_more = true, requests = 0;
	const fileList = [];
	do {
		// const args = { path, recursive };
		requests++;
		// debug(`getFileList > request #${requests}`);

		let response;
		if (cursor) response = await dropbox.filesListFolderContinue({ cursor });
		else response = await dropbox.filesListFolder({ path, recursive });

		const { entries } = response;
		cursor = response.cursor;
		has_more = response.has_more;
		fileList.push(...entries.map(entry => entry.path_lower));
	} while(has_more && requests < CONFIG.MAX_SEQUENTIAL_REQUESTS);

	// clean data
	for (let i = 0; i < fileList.length; i++) {
		fileList[i] = fileList[i].replace(CONFIG.ROOT_PATH.toLowerCase(), '');
	}

	// return
	// debug('getFileList > fileList = ',fileList);
	set(cacheKey, fileList);
	return fileList;
}

function ingestAccessToken(_token) {
	const token = _token || window.location.hash.substr(1).split('&').filter(a => a.match('access_token'))[0].substr(13);
	localStorage.setItem('accessToken', token);
}

function isAuthenticated() {
	// return window.location.hash.match('access_token');
	return localStorage.getItem('accessToken');
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