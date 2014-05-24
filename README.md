# grunt-amd-shim

> Creates a define wrapper around javascript libraries to support anonymous amd loading

## About
This grunt plugin provides a build task for making javascript libraries that do not include the define pattern compatible with amd loaders like requirejs by wrapping the code in an define call. 

Also, most of the javascript libraries expose one or more global variables to the global window scope. This can lead to version conflicts when the embedding document also requires those modules.
The amdshim task anonymizes the module by saving and restoring previously set globals and exporting the reference loaded by amd. 


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-amd-shim --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-amd-shim');
```

## The "amd_shim" task

### Overview
In your project's Gruntfile, add a section named `amd_shim` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  amd_shim: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.exports
Type: `String`
Default value: `''`

The global reference to be exported as module definition, for example `$`

#### options.dependencies
Type: `Object`
Default value: `{}`

An object containing amd-dependencies as keys and the variable names they should have in the definition body, for example `{jquery: $}`

#### options.globals
Type: `Array`
Default value: `[]`

An array containing global keys, for example `[$, jQuery]` Pass an object to expose references to global scope, i.e. {$: $} or {jQuery: myJQuery} 

### Usage Examples

#### jQuery
JQuery already registers as amd-module, so we only want to hide our imported version from the global scope:

```js
grunt.initConfig({
  amd_shim: {
    jquery: {
      options: {
        globals: ['$', 'jQuery'] 
      },
      files: {
        'dest/jquery.js': ['test/fixtures/jquery.min.js'],
      }
    }
  }
});
```

#### MediaElement.js
To make MediaElement.js work as 3rd-party amd-module, generally we need to include jQuery as dependency, hide / preserve global objects 'mejs' and 'MediaElement' and export the private 'mejs'-reference.

Problem here is, that a flash-plugin will still communicate over a global object named 'mejs.MediaPluginBridge'.  
The global bridge identifier is hardcoded in the flash source. So you may need to fork a recent version and provide a patch to make the bridge identifier configurable via flashvars. Note that there are no changes required to mediaelement.js. 

To rename the global 'mejs'-object you can specify an object containing key/value-pairs as 'global'-option:

```js
grunt.initConfig({
  amd_shim: {
    mediaelement: {
      options: {
        exports: 'mejs', 
        dependencies: {
          jquery: '$'
        }, 
        globals: {
          mejs: 'my_mejs', 
          MediaElement: ''
        }
      },
      files: {
        'dest/mediaelement.js': ['src/mediaelement-and-player.min.js']
      }
    }
  }
});
```

In order to make mediaelement.swf work with our renamed global, you will also need to set some default options. 
This is an example using requirejs: 
```js
// main.js
define('mediaelement', [
  'require', 
  'jquery', 
  'mediaelement-and-player'
], function(require, $, mejs) {
  
  // set defaults
  mejs.MediaElementDefaults.pluginVars = "bridge=my_mejs.MediaPluginBridge";
  mejs.MediaElementDefaults.pluginPath = require.toUrl('lib/mediaelement/build/');
  
  return mejs;
});

require(['mediaelement'], function(mejs) {
  // init player
  var player1 = new mejs.MediaElementPlayer('#player1');
});
```
  
## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
