// NOTE: window.Dropbox is magically inserted via Dropbox SDK. sigh...

import { get, set } from '/helpers/cache.js';

export { downloadFile, getDropbox, getLogin, ingestAccessToken, isAuthenticated };


const CONFIG = { // todo: this should be server-side and proxied!
	CLIENT_ID: 's4jxaurwyqdw6jq',
	ROOT_PATH: '/RPG Root/RPG/wiki',
}

async function downloadFile({ dropbox=getDropbox(), hardpath }) {
	const path = `${CONFIG.ROOT_PATH}/${hardpath}`.replace(/\/\//g, '/');
	const response = await dropbox.filesDownload({ path });
	const fileContent = await readBlob(response.fileBlob);
	return fileContent
}

async function getLogin({ returnUrl='http://localhost:8080/login/success' }={}) {
	const dbx = new Dropbox.Dropbox({ clientId: CONFIG.CLIENT_ID });
	const authUrl = dbx.getAuthenticationUrl(returnUrl);
	return authUrl;
}

function getDropbox() {
	if (isAuthenticated()) {
		return new Dropbox.Dropbox({ accessToken: localStorage.getItem('accessToken') });
	} else {
		window.history.pushState({ returnUrl:window.location.href }, 'Phobos > log in to dropbox', '/login');
	} 
}

function ingestAccessToken() {
	const token = window.location.hash.substr(1).split('&').filter(a => a.match('access_token'))[0].substr(13);
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