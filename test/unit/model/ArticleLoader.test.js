import { load } from '../../../src/model/services/ArticleLoader';

// const { foo } = getTestData();
const { downloadFile, getFileList } = getMockServices();


test('load > test case 1', async () => {
	const fuzzypath = '/foo';
	const expected = {
		article: {
			file: {
				contents: 'foo contents',
				extension: '.md',
				filename: 'foo.md',
				hardpath: '/foo.md',
				type: 'file',
			}
		},
		menu: null,
		style: null,
	}
	const actual = await load({ fuzzypath, _downloadFile:downloadFile, getFileList });
	expect(actual.extension).toStrictEqual(expected.extension);
	expect(actual.filename).toStrictEqual(expected.filename);
	expect(actual.hardpath).toStrictEqual(expected.hardpath);
	expect(actual.contents).toStrictEqual(expected.contents);
})


function getMockServices() {
	return {
		downloadFile: ({ hardpath }) => {
			switch (hardpath) {
				case '/foo.md': return 'foo contents';
				case '/bar.md': return 'bar contents';
				case '/menu.md': return 'menu contents';
				case '/style.css': return 'style contents';
				default: return 'unknown contents';
			}
		},
		getFileList: () => [
			'/foo.md',
			'/bar.md',
			'/menu.md',
			'/style.css',
		]
	}
}

function getTestData() {
	return {
		fileLists: {
			1: [
				'/menu.html',
				'/_menu.yml',
				'/foo/',
				'/foo/menu.md',
				'/foo/menu.txt',
			]
		},
		candidates: {
			menu: {
				1: [
					'/_menu.html',
					'/_menu.yml',
					'/_menu.md',
					'/_menu.txt',
					'/menu.html',
					'/menu.yml',
					'/menu.md',
					'/menu.txt',
					'/foo/_menu.html',
					'/foo/_menu.yml',
					'/foo/_menu.md',
					'/foo/_menu.txt',
					'/foo/menu.html',
					'/foo/menu.yml',
					'/foo/menu.md',
					'/foo/menu.txt',
				]
			}
		},
		scoredCandidates: {
			menu: {
				1: [
					{ candidate:'/_menu.html',     score:[0,-1,0] },
					{ candidate:'/_menu.yml',      score:[0,-1,1] },
					{ candidate:'/_menu.md',       score:[0,-1,2] },
					{ candidate:'/_menu.txt',      score:[0,-1,3] },
					{ candidate:'/menu.html',      score:[0,-1,0] },
					{ candidate:'/menu.yml',       score:[0,-1,1] },
					{ candidate:'/menu.md',        score:[0,-1,2] },
					{ candidate:'/menu.txt',       score:[0,-1,3] },
					{ candidate:'/foo/_menu.html', score:[-1,-5,0] },
					{ candidate:'/foo/_menu.yml',  score:[-1,-5,1] },
					{ candidate:'/foo/_menu.md',   score:[-1,-5,2] },
					{ candidate:'/foo/_menu.txt',  score:[-1,-5,3] },
					{ candidate:'/foo/menu.html',  score:[-1,-5,0] },
					{ candidate:'/foo/menu.yml',   score:[-1,-5,1] },
					{ candidate:'/foo/menu.md',    score:[-1,-5,2] },
					{ candidate:'/foo/menu.txt',   score:[-1,-5,3] },
				],
			},
		}
	}
}