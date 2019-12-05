
# Preference
General rules:
+ Fewer file lookups > more file lookups
+ Deeper path > shallower path (depth-first)
+ Specific > general
+ Less parsing > more parsing

Given the path "/foo", the preference is as follows.
1. /foo (exact match for file)
2. /foo/foo.(ext)
3. /foo/index.(ext)
4. /foo.(ext)

Extension preference:
1. HTML / CSS / JS (natively renderable)
2. MD / YML (standard markup)
3. TXT (non-standard markup, i.e. wikitext)