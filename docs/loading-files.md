# How Loading Files works

+ input: fuzzy path (e.g. "/foo/bar")
+ dependencies: up-to-date FileList
+ output: final file

1. start with fuzzy path
2. checkFileList
  + if FileList does not exist, error
  + if FileList is out of date, proceed, but mark for refresh later and notify user of staleness
  + if FileList is up-to-date, proceed
3. resolve actual filename
  + using FileList, disambiguate fuzzy path into actual path, following the [file resolution guidelines](./file-resolution.md)
4. load file
5. return
6. if flagged for refresh, trigger refresh of FileList, then update all flagged files