# Overview

## Classes
+ TBD: an article, menu, and style, suitable for rendering an entire ArticleView (may not need to exist)
+ Article: a text document (not a menu or style), contains a File
+ File: a file, optionally loaded

### maybe
+ Menu
+ Style
+ Image
+ etc...

## Services
+ IFileLoader: knows how to load files (abstracts a DAL specific to data source)
+ Cache: caches files (abstracts Redis or whatever)



# Class Definitions

## Article

### Properties
+ file: IFile

### Methods
+ render: () => html



## FileMetadata

### Properties
+ hardpath: String (full absolute path, where '/' is wikiroot)
+ extension: String (File extension, e.g. '.md')
+ type: String (file || folder || ambiguous)
+ filename: String (just the filename, with extension; e.g. 'foo.md')

### Static Methods
+ fromFuzzyPath: fuzzyPath => FileMetadata

### Methods
+ load: () => FileData



## FileData
+ extends FileMetadata

### Properties
+ (super)
  + type should always be file or folder
  + filename and extension will have been fully resolved
+ contents: String (contents, utf-8 encoded)



## IFileLoader

### Methods
+ load: hardpath => 




