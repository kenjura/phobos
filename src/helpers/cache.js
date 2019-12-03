export { get, set };

function get(key) {
	if (sessionStorage.getItem(key)) {
		console.debug(`cache hit for "${key}"`);
		return JSON.parse(sessionStorage.getItem(key));
	} else {
		return 
	}
}

function set(key, val) {
	const valStr = typeof(val) === 'object' ? JSON.stringify(val) : val;
	return sessionStorage.setItem(key, valStr);
}