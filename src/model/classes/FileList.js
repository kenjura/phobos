export default class FileList extends Array {
	constructor(props, ...items) {
		super(...items);

		this.lastRefreshedAt = props.lastRefreshedAt;
	}
}