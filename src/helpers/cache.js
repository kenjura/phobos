import Dexie from 'dexie';

export { get, set };

const db = new Dexie('cache-db');
db.version(1).stores({
	cache: '++id,date,key,value'
})

async function get(key) {
	const cached = await db.cache.where({ key }).toArray(); // TODO: add cache expiry
	if(!cached || !cached.length) return null;
	return cached[0].value;
}

async function set(key, value) {
	const cached = await db.cache.add({
		key,
		value,
		date: Date.now(),
	});
	return cached;
}