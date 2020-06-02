import { Dropbox } from 'dropbox';
import { get, set } from '../../helpers/cache.js';
import { parse } from 'query-string';

export { downloadFile, getDropbox, getFileList, getLogin, ingestAccessToken, isAuthenticated, uploadFile };


const CONFIG = { // todo: this should be server-side and proxied!
	CLIENT_ID: 's4jxaurwyqdw6jq',
	ROOT_PATH: '/RPG Root/RPG/wiki',
	MAX_SEQUENTIAL_REQUESTS: 10,
}

async function downloadFile({ dropbox=getDropbox(), hardpath }) {
	const cacheKey = `file: ${hardpath}`;
	const cached = await get(cacheKey);
	if (cached) return cached;
	// if (get(cacheKey)) return get(cacheKey);
	// console.warn('dropbox > downloadFile > cache get temporarily disabled!!!');
	const path = `${CONFIG.ROOT_PATH}/${hardpath}`.replace(/\/\//g, '/');
	const response = await dropbox.filesDownload({ path });
	const fileContent = await readBlob(response.fileBlob);
	set(cacheKey, fileContent);
	return fileContent;
}

async function getLogin({ returnUrl='http://localhost:8080/login/success', state={} }={}) {
	const dbx = new Dropbox({ clientId: CONFIG.CLIENT_ID });
	const authUrl = dbx.getAuthenticationUrl(
		returnUrl,
		typeof(state) === 'string' ? state : JSON.stringify(state)
	);
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
	const cached = await get(cacheKey);
	if (cached && !args.noCache) return cached;

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
	console.log('real fn');
	const token = 
		_token 
		|| parseMagicalBullshitDropboxReturnUrlInHistoryStateForSomeFuckingReason()
		|| window.location.hash.substr(1).split('&').filter(a => a.match('access_token'))[0].substr(13);
	localStorage.setItem('accessToken', token);
	return true;
}

function isAuthenticated() {
	// return window.location.hash.match('access_token');
	return localStorage.getItem('accessToken');
}

function parseMagicalBullshitDropboxReturnUrlInHistoryStateForSomeFuckingReason() {
	if (window.history.state && window.history.state.returnUrl) {
		const url = window.history.state.returnUrl;
		const fakeQueryString = url.substr(url.indexOf('#')+1);
		const fakeQsParms = fakeQueryString.split('&').map(kvp => ({ [kvp.split('=')[0]]:kvp.split('=')[1] }));
		return fakeQsParms['access_token'];
	}

	//http://localhost:8080/login/success#access_token=vEY8dPHtxfAAAAAAAAIwtRI5qcRty0oiqljOADPgYYqu2Kg87-YtEtdSm9rOQ1LX&token_type=bearer&uid=12374&account_id=dbid%3AAAAyOtafrGch4qolGhCZAlG-qB7MpQtIgDQ
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


async function uploadFile({ dropbox=getDropbox(), hardpath, contents }) {
	const path = `${CONFIG.ROOT_PATH}/${hardpath}`.replace(/\/\//g, '/');
	const obj = {
		contents,
		path,
		mode: 'overwrite',
	}
	const response = await dropbox.filesUpload(obj);
	const filesMetadata = await readBlob(response.fileBlob);
	return filesMetadata;
}
