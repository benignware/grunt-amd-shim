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
          
          
          var depValues = [];
          for (var x in options.dep) {
            depValues.push(options.dep[x]);
          }
          var depKeys = Object.keys(options.dep);
          
          output+= "define(" + JSON.stringify(depKeys) + ", function(" + depValues.join(", ") + ") {\n\n";
          
          output+= "var _____globals = {};\n";
          
          output+= "_____globals._public = {\n";
          for (var i = 0, global; global = options.global[i]; i++ ) {
            output+= "\t" + global + ": window." + global + ", \n";
          }
          output+= "};\n";
          
          output+= grunt.file.read(f.src) + "\n";
          
          
          output+= "_____globals._private = {\n";
          for (var i = 0, global; global = options.global[i]; i++ ) {
            output+= "\t" + global + ": window." + global + ", \n";
          }
          output+= "};\n";
          
          output+= "for (var x in _____globals._public) {\n";
          output+= "\twindow[x] = _____globals._public[x];\n";
          output+= "}\n";
          
          
          output+= "return _____globals._private['" + options.exports + "'];\n";
          output+= "});";
          
          grunt.file.write(f.dest, output);

        });
    });
    
};
