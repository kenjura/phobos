import { treeFrom } from '../../../src/model/services/FileListLoader';

describe('FileListLoader', () => {
	test('treeFrom > test case 1', async () => {
		const fileList = [
			'/foo',
			'/foo/bar',
			'/foo/baz',
			'/foo/qux',
			'/foo/qux/xyzzy',
		];
		const expected = [
			{ 
				path: '/foo',
				parent: null,
				children: [
					{
						path: '/foo/bar',
						parent: '/foo',
						children: []
					},
					{
						path: '/foo/baz',
						parent: '/foo',
						children: []
					},
					{
						path: '/foo/qux',
						parent: '/foo',
						children: [
							{
								path: '/foo/qux/xyzzy',
								parent: '/foo/qux',
								children: []
							}
						]
					},
				]
			}
		];
		const actual = treeFrom({ fileList });
		expect(actual).toStrictEqual(expected);
	})

	test('treeFrom > test case 2', async () => {
		const fileList = [
			'/foo',
			'/foo/bar',
			'/goo',
		];
		const keys = {
			children: 'xchildren',
			parent: 'yparent',
			path: 'zpath',
		}
		const expected = [
			{ 
				zpath: '/foo',
				yparent: null,
				xchildren: [
					{
						zpath: '/foo/bar',
						yparent: '/foo',
						xchildren: []
					},					
				]
			},
			{
				zpath: '/goo',
				yparent: null,
				xchildren: [],
			}
		];
		const actual = treeFrom({ fileList, keys });
		expect(actual).toStrictEqual(expected);
	})

});
