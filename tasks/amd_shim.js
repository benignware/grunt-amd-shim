/*
 * grunt-amd-shim
 * https://github.com/benignware/grunt-amd-shim
 *
 * Copyright (c) 2014 Rafael Nowrotek
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('amd_shim', 'Creates a define wrapper around javascript libraries to support anonymous amd loading', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      exports: '', 
      dependencies: [],
      globals: []
    });

    // Iterate over all specified file groups.
      
    this.files.forEach(function(f) {
      
      
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file ' + filepath + ' not found.');
          return false;
        } else {
          return true;
        }
      });

      if (src.length === 0) {
        grunt.log.warn('Destination ' + f.dest + ' not written because src files were empty.');
        return;
      }
      
      var output = "";
      
      var globalObject = {};
      var globalArray = [];
      if (options.globals instanceof Array) {
        globalArray = options.globals;
        globalObject = {};
        options.globals.forEach(function(f) {
          globalObject[f] = '';
        });
      } else if (typeof options.globals == 'object') {
        globalObject = options.globals;
        globalArray = Object.keys(globalObject);
      }
      
      // start closure
      output+= "(function() {\n";
      
      // store globals
      output+= "var globals = {};\n";
      output+= "globals['public'] = {\n";
      for (var i = 0, global; global = globalArray[i]; i++ ) {
        output+= "\t" + global + ": window['" + global + "']";
        if (globalArray[i + 1]) {
          output+= ", ";
        }
        output+= "\n";
      }
      output+= "};\n";
      
      if (options.exports) {
        
        // start define
        
        var depValues = [];
        for (var x in options.dependencies) {
          var depValue = options.dependencies[x];
          if (depValue instanceof Array) {
            depValue = depValue[0];
          }
          depValues.push(depValue);
        }
        
        var depKeys = Object.keys(options.dependencies) || [];
        
        output+= "define(" + JSON.stringify(depKeys) + ", function(" + depValues.join(", ") + ") {\n\n"; 
        
        for (var x in options.dependencies) {
          
          var depValue = options.dependencies[x];
          var depValueExports = null;
          if (depValue instanceof Array) {
            depValueExports = depValue;
            var depValueOtherExports = depValue.slice(1);
            depValue = depValue[0];
            for (var i = 0, depValueExport; depValueExport = depValueOtherExports[i]; i++) {
              output+= "var " + depValueExport + " = " + depValue + ";\n";
            }
          } else {
            depValueExports = [depValue];
          }
          
          if (depValueExports) {
            for (var i = 0, depValueExport; depValueExport = depValueExports[i]; i++) {
              if (!!~globalArray.indexOf(depValueExport)) {
                output+="window['" + depValueExport + "'] = " + depValueExport + ";\n";
              }
            }
          }
        }
      }
      
      output+= grunt.file.read(f.src) + "\n";
      
      output+= "globals['private'] = {\n";
      for (var i = 0, global; global = globalArray[i]; i++ ) {
        output+= "\t" + global + ": window['" + global + "']";
        if (globalArray[i + 1]) {
          output+= ", ";
        }
        output+= "\n";
      }
      output+= "};\n";
      
      output+= "for (var x in globals['public']) {\n";
      output+= "\twindow[x] = globals['public'][x];\n";
      output+= "}\n";
      
      
      // restore globals
      for (var x in globalObject) {
        if (globalObject[x]) {
          output+= "window['" + globalObject[x] + "'] = globals['private']['" + x + "'];\n";
        }
      }
      
      if (options.exports) {
        // export module
        output+= "\treturn globals['private']['" + options.exports + "'];\n";

        // end define
        output+= "});\n";
      }
      
      // end closure
      output+= "})();";
      
      grunt.file.write(f.dest, output);
      
      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
      
    });

  });

};