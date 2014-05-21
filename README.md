grunt-amdshim
=============
Build a define wrapper around javascript libraries to support anonymous amd loading. 


About
-----
This grunt plugin provides a build task for making older libraries that do not include the define pattern compatible with amd loaders like requirejs by wrapping the code in an define call. 

Also, most of the javascript libraries expose one or more global variables on the window-object. This can lead to version conflicts when the embedding document also requires those modules.
The amdshim task controls this by saving and restoring previously set globals and exporting the reference loaded by amd. 

To achieve this, the plugin provides the following options: 

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>dep</td>
    <td>An object containing dependencies as name/value pairs</td>
  </tr>
  <tr>
    <td>global</td>
    <td>An array containing the names of the exposed globals</td>
  </tr>
  <tr>
    <td>exports</td>
    <td>The name of the variable that should be exported by the module definition</td>
  </tr>
</table>

Example
-------
Configure an amdshim for mediaelement.js

```
// install using cli
npm install git://github.com/benignware/grunt-amdshim.git
```

```
// Gruntfile.js
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    amdshim: {
      mediaelement: {
        src: 'src/lib/mediaelement/build/mediaelement-and-player.js', 
        dest: 'build/lib/mediaelement/build/mediaelement-and-player.js', 
        options: {
          dep: {
            jquery: '$'
          }, 
          global: ['mejs', 'MediaElementPlayer'], 
          exports: 'mejs'
        }
      }
    }
  });
}
grunt.registerTask('default', ['amdshim:mediaelement']);
```

Execute the task from the command line:
```
grunt amdshim:mediaelement
```

Notes
-----
Note that this method may not work with javascript libraries that do not only expose their private variables to global access but also directly work with those global references.

  
 

