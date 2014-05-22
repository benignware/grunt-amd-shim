grunt-amdshim
=============
Build a define wrapper around javascript libraries to support anonymous amd loading. 


About
-----
This grunt plugin provides a build task for making older libraries that do not include the define pattern compatible with amd loaders like requirejs by wrapping the code in an define call. 

Also, most of the javascript libraries expose one or more global variables on the window-object. This can lead to version conflicts when the embedding document also requires those modules.
The amdshim task controls this by saving and restoring previously set globals and exporting the reference loaded by amd. 

Install
-------
```
npm install git://github.com/benignware/grunt-amdshim.git
```

Options
-------
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

Examples
--------


### jQuery
Since jQuery already registers as amd-module, we only want to hide our imported version from the global scope:
```
// Gruntfile.js
module.exports = function(grunt) {
  grunt.initConfig({
    jquery: {
      src: 'src/lib/jquery/dist/jquery.min.js', 
      dest: 'tmp/lib/jquery/dist/jquery.min.js', 
      options: { 
        global: ['$', 'jQuery']
      }
    }
  });
}
grunt.registerTask('default', ['amdshim:jquery']);
```


### MediaElement.js
To make MediaElement.js work as 3rd-party amd-module, generally we need to include jQuery as dependency, hide / preserve global objects 'mejs' and 'MediaElement' and export the private 'mejs'-reference.
```
// Gruntfile.js
module.exports = function(grunt) {
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
```

Problem here is, that a flash-plugin will still communicate over a global object named 'mejs.MediaPluginBridge'.  
The global bridge identifier is hardcoded in the flash source. So you may need to fork a recent version and provide a patch to make the bridge identifier configurable via flashvars. 

To rename the global 'mejs'-object you can specify an object containing key/value-pairs as 'global'-option:
```
// Gruntfile.js
module.exports = function(grunt) {
  grunt.initConfig({
    amdshim: {
      mediaelement: {
        src: 'src/lib/mediaelement/build/mediaelement-and-player.js', 
        dest: 'build/lib/mediaelement/build/mediaelement-and-player.js', 
        options: {
          dep: {
            jquery: '$'
          }, 
          global: {
            'mejs': 'my_mejs',
            'MediaElementPlayer': ''
          }, 
          exports: 'mejs'
        }
      }
    }
  });
}
```

In order to make the plugin work, you will also need to set some default options. 
This is an example using requirejs: 
```
define('mediaelement', [
  'require', 
  'jquery', 
  'mediaelement-and-player'
], function(require, $, mejs) {
  
  // set defaults
  mejs.MediaElementDefaults.pluginVars = "bridge=my_mejs.MediaPluginBridge";
  mejs.MediaElementDefaults.pluginPath = require.toUrl('lib/mediaelement-hls/build/');
  
  return mejs;
});
```

```
require(['mediaelement'], function(mejs) {
  // init player
  // ...
});
```
  
By the way, we still need to prefix the css... ;-)




Notes
-----
Note that this method may not work with javascript libraries that do not only expose their private variables to global access but also directly work with those global references.