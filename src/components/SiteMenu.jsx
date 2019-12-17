import PropTypes from 'prop-types';
import React from 'react';

import { loadFileList, treeFrom } from '../model/services/FileListLoader';
import { Tree } from 'antd';
import { withRouter } from 'react-router-dom';

import './SiteMenu.scss';

const { DirectoryTree, TreeNode } = Tree;

export default class SiteMenu extends React.Component {
	static propTypes = {
		currentKey: PropTypes.string.isRequired,
		fileList: PropTypes.arrayOf(PropTypes.string).isRequired,
	}

	constructor(props) {
		super(props);

		this.state = {
			treeNodes: [],
		}
	}

	componentDidMount() {
		this.getData(this.props);
	}

	getData({ fileList=[] }) {
		const keys = {
			children: 'children',
			parent: 'parent',
			path: 'key',
		};
		const transformFn = obj => {
			obj.title = obj.key;
			obj.isLeaf = !Array.isArray(obj.children) || obj.children.length < 1;
		};
		const treeData = treeFrom({ keys, fileList, transformFn })
			.sort((a,b) => a.title > b.title ? 1 : -1);
		this.setState({ treeData });
	}

	render() {
		const { treeData } = this.state;
		return <nav id="site-menu">
			<DirectoryTree 
				defaultExpandedKeys={ [this.props.currentKey] } 
				multiple 
				treeData={ treeData }
				onExpand={ (keys,evt) => console.log({keys,evt}) }
				onSelect={ (selectedKeys,evt) => this.props.onSelect(selectedKeys) }
			>
			</DirectoryTree>
		</nav>
	}
}

export class SiteMenuLoader extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fileList: [],
		}
	}

	componentDidMount() {
		this.start();
	}

	async start() {
		const fileList = await loadFileList();
		this.setState({ fileList });
	}

	onSelect(selectedKeys=[]) {
		const [ target ] = selectedKeys;
		const { history } = this.props;
		history.push(target);
	}

	render() {
		const { currentKey } = this.props.location.pathname;
		const { fileList } = this.state;
		return <SiteMenu 
			key={fileList.length} 
			currentKey={currentKey} 
			fileList={fileList} 
			onSelect={selectedKeys => this.onSelect(selectedKeys)}
		/>
	}
}
