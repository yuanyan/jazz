var path = require('path');
var fs   = require('fs');
var src  = path.join(path.dirname(fs.realpathSync(__filename)), '../src');
var jazz = require(src+'/jazz');
var	compile = jazz.compile;



if (require.extensions) {
	require.extensions['.jazz'] = function(module, filename) {
	  var content = compile(fs.readFileSync(filename, 'utf8'), {
		filename: filename
	  });
	  return module._compile(content, filename);
	};
} else if (require.registerExtension) {
	require.registerExtension('.jazz', function(content) {
	  return compile(content);
	});
}

var file =  process.argv[2];
	file = path.join(path.dirname(fs.realpathSync(__filename)), file),
	filedir = path.dirname(file),
	fileext= path.extname(file),
	filebasename = path.basename(file,fileext),
	astjsonfile = path.join(filedir, filebasename+ ".json"),
	targetjsfile = path.join(filedir, filebasename+ ".js");

console.log("input: "+file);	
var m = jazz.parse(fs.readFileSync(file, 'utf8'));

fs.writeFileSync(astjsonfile, JSON.stringify(m, null, "    "));
console.log('output: '+astjsonfile);
fs.writeFileSync(targetjsfile, jazz.stringify(m));
console.log('output: '+targetjsfile);

console.log('compile success');