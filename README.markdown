# MM_js_lib #

My Modular JavaScript Library


## Overview ##

This is a collection of JavaScript *classes*/*helpers*/*methods* created for personal use and also for learning purposes.

It was created to be used when only some specific features are required avoiding the use of a full bloated framework when it isn't really necessary.

It was also created because I don't agree with some frameworks APIs and the coding style that they "enforce".


## Main goals: ##

 - be modular;
 - be clear;
 - be easy to debug;
 - be easy to maintain;
 - follow best practices;
 - follow standards when possible;
 - **don't convert JavaScript into another language!**
 - be compatible with other frameworks;
 - be simple;
 - be small;
 - be fully documented;


## Important ##

 - **This Library is on an EARLY ALPHA state and no proper testing was made (bugs are expected).**
 - The API, packages and coding conventions are not totally defined yet. (Files/Folders may disappear. APIs may change. Things may break.)
 - All code here is released under the [MIT License](http://www.opensource.org/licenses/mit-license.php) unless otherwise noted.
 - I don't give any kind of support on how to use these files.
 - Almost everything is a work in progress.
 - This library is only intended to work on well-formed HTML files, so always use the proper doctype (strict or transitional) and validate your HTML/XHTML.
 - Some functionalities may not work properly on specific mobile devices.
 - I will probably only test the code on the latest non-beta version of Firefox, Safari, Chrome, Opera and also IE6+.
 - Probably It will never have most of the features that exist on the major frameworks.
 

## Should I use it? ##

This library was designed for *intermediate* to *advanced* JavaScript developers, if you're starting with JavaScript development I recommend using a framework that you can easily find tutorials on the internet, such as [jQuery](http://jquery.com), [MooTools](http://mootools.net) and [prototype](http://www.prototypejs.org/).

If you're building desktop-like applications it's better to use a JavaScript Framework that already has UI widgets. Check the [comparison list of JavaScript frameworks on Wikipedia](http://en.wikipedia.org/wiki/Comparison_of_JavaScript_frameworks) to know the differences between each one.

This library was created mainly to be used on small to medium web sites.


## Coding Conventions ##

### Code structure ###
 - don't over-complicate the structure unless the gain in performance/maintainability/reliability justifies it (if you do it, add a comment explaining what it does and why).
 - encapsulate your code, never pollute the global scope unless it's really necessary (use closures, namespaces...).
 - never extend or overwrite native Objects prototypes.

### Documentation ###
 - always document the source code using a JavaDoc like style, see [jsdoc-toolkit wiki](http://code.google.com/p/jsdoc-toolkit/wiki/TagReference) for further details.
 - always add comments to parts of the code that may be unclear to other developers and/or that solves specific bugs.
 - always add the proper credits if the specific method was based/inspired/ported/copied/etc by someone's code/idea/article even if you implemented it in a different way. (it can be used as a reference in the future and also to detect and report possible bugs)
 - always prefer readable/meaningful code over small code; compressors can do a good job reducing the file size so there's no real reason to make the code unreadable and hard to maintain & debug.
 - always add notes inside the source code about improvement ideas, what still needs to be done and fixed using the Eclipse task tags: "XXX", "TODO" and "FIXME".

### Naming conventions ###
 - write clear methods/variables names and if possible follow W3C standards or common naming conventions.
 - always start `private` methods and vars names with an underscore "_" even if it isn't a "real" private member to make it clear that this var/method shouldn't be accessed from outside.
 - `Class` names should always start with a capital letter.
 - `constant` names should always be written in "ALL_CAPS" and words should be separated by a "_" (underscore).
 - `var` and `method` names should always be in "camelCase".


## Inspiration ##
 
It was heavily inspired by other frameworks and other people work/articles/ideas and they're are properly credited on the source code. Just to cite a few of them:

 - [Nicholas C. Zackas](http://nczonline.net/)
 - [Peter-Paul Koch](http://www.quirksmode.org/)
 - [Dean Edwards](http://dean.edwards.name/)
 - [John Resig](http://ejohn.org/) and [jQuery](http://jquery.com/)
 - [MooTools](http://mootools.net/)
 - [YUI3](http://developer.yahoo.com/yui/3/)
 - [Thomas Fuchs](http://mir.aculo.us/)


----


&copy; [Miller Medeiros](http://www.millermedeiros.com)