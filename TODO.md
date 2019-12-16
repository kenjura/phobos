# Urgent
+ resolver > resolveArticle > can't handle it when filteredCandidates.length === 0
  + it should use a method of constructing paths similar to resolveMenuOrStyle

# 0.2.0
+ [ ] Article
  + [ ] Auto-index for valid folders with no index
+ [ ] Style
  + [ ] Top Menu
    + [ ] Site root (left column of topMenu and body, expands to show folder structure)
  + [ ] Preload
    + [ ] While FileList is loading, show preloader, which prevents actions depending on its completion
    + [ ] Use cache layer (indexedDB? localstorage?) to prevent hammering FileList
    + [ ] Ultimately, FileList should be built by a service worker in the background (and synced as such)

# 0.3.0
+ [ ] Caching
  + [ ] Implement cache expiry
  + [ ] Use separate collections for fileList, file, etc?
  + [ ] Memoization is good, but maybe expire mem cache after a second or two, as indexedDB should handle caching past that point


# Alpha 1

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