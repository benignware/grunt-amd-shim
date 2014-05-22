module.exports = function(grunt) {
    
    grunt.registerMultiTask('amdshim', 'build an define wrapper around a js file', function() {
       
        var options = this.options({
          // defaults
        });
        
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
          if (options.global instanceof Array) {
            globalArray = options.global;
            globalObject = {};
            options.global.forEach(function(f) {
              globalObject[f] = '';
            });
          } else if (typeof options.global == 'object') {
            globalObject = options.global;
            globalArray = Object.keys(globalObject);
          }
          
          // start closure
          output+= "(function() {";
          
          // start define

          if (options.exports) {
            
            var depValues = [];
            for (var x in options.dep) {
              depValues.push(options.dep[x]);
            }
            var depKeys = Object.keys(options.dep) || [];
            
            output+= "define(" + JSON.stringify(depKeys) + ", function(" + depValues.join(", ") + ") {\n\n";
          }
          
          output+= "var globals = {};\n";
          
          output+= "globals['public'] = {\n";
          for (var i = 0, global; global = globalArray[i]; i++ ) {
            output+= "\t" + global + ": window." + global + ", \n";
          }
          output+= "};\n";
          
          output+= grunt.file.read(f.src) + "\n";
          
          
          output+= "globals['private'] = {\n";
          for (var i = 0, global; global = globalArray[i]; i++ ) {
            output+= "\t" + global + ": window." + global + ", \n";
          }
          output+= "};\n";
          
          output+= "for (var x in globals['public']) {\n";
          output+= "\twindow[x] = globals['public'][x];\n";
          output+= "}\n";
          
          for (var x in globalObject) {
            if (globalObject[x]) {
              output+= "window['" + globalObject[x] + "'] = globals['private']['" + x + "'];\n";
            }
          }
          
          if (options.exports) {
            // export module
            output+= "\treturn globals['private']['" + options.exports + "'];\n";
            
            // end define
            output+= "});";
            
          }
          
          // end closure
          output+= "})();";
          
          grunt.file.write(f.dest, output);

        });
    });
    
};
