# What's going on

Currenltly not working.

Recently migrated to new model system. Everything should work, except the resolver requires a file list.

Need to migrate getFileList from leeloo, then provide fileList to FileLoader > resolveAndLoad (referenced in ArticleView).

For now, I'm faking it with a hard-coded fileList to make sure everything else works. It does, seemingly. To the extent it was tested, of course.

Also, I should probably change File.contents to File.content (or just settle on one).


# Phobos

An in-browser Markdown (and legacy Wikitext) CMS, using Dropbox (and some day other stores) as a data store

More README.md tbd..