export default class File {
	constructor(props) {
		this.fuzzypath = props.fuzzypath;
		this.hardpath = props.hardpath;
		this.extension = props.extension;
		this.type = props.type;
		this.filename = props.filename;
		this.contents = props.contents;
		this.loadedAt = props.loadedAt;
		this.loaded = !!this.contents;
	}
}