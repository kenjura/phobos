# Urgent
+ [ ] dropbox downloadFile cache is broken! replace with serviceWorker cache!!
+ [ ] need to memoize ArticleLoader parallel loads to avoid redundant calls
+ [x] remove test and other objects no longer in use


# Alpha 1

+ [ ] Top Menu
+ [ ] Style
+ [ ] Debug Tools (show file metadata, cache info, etc)
+ [ ] Edit Mode
+ [ ] Re-enable unit tests
+ [ ] autoIndex pages
+ [ ] testing
  + [ ] parseFileMetadata
    + [ ] add tests for getTitle (including when filename === null)
    + [ ] add tests for parseFileMetadata
  + [ ] resolver
    + [ ] separate getCandidates, score, and sort steps for testability
    + [ ] remove magic difference between articles, menu, and style
    + [ ] current tests are not catching the fact that resolveMenuOrStyle DOES NOT FILTER BASED ON FILELIST (moron)
    + [ ] current tests likely broken because candidate pseudo-model in resolveMenuOrStyle has been changed to "hardpath" instead of "candidate" to match the output of resolve()
  + [ ] migrate old in-browser tests
  + [ ] everything else ;-)


# Alpha 2

+ [ ] Better login integration (cleaner, doesn't use localStorage, etc)
+ [ ] Better cache, especially for FileList
+ [ ] Cache TTL
+ [ ] Improve test coverage
+ [ ] Restore serviceWorker.js


# Alpha 3

+ [ ] Secure dropbox config somehow
+ [ ] Partial FileList updates


# ???

+ [ ] New styles (purple cat!)
+ [ ] Parcel productionization
+ [ ] PWA productionization
+ [ ] Github action / prod pipeline