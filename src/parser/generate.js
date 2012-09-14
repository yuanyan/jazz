var fs = require('fs');
var JISON = require('jison');

function processGrammar (rawGrammar, lex, name) {
    var grammar = require("jison/jison/bnf").parse(rawGrammar);
    var opt = grammar.options || {};
    if (lex) grammar.lex = require("jison/jison/jisonlex").parse(lex);
    if (!opt.moduleType) opt.moduleType = "commonjs";
    if (!opt.moduleName && name) opt.moduleName = name.replace(/-\w/g, function (match){ return match.charAt(1).toUpperCase(); });

    var generator = new JISON.Generator(grammar, opt);
    return generator.generate(opt);
}

var grammar = fs.readFileSync('grammar.y', 'utf8');
var lex = fs.readFileSync('lexer.l', 'utf8');

console.log("working...");
var source = processGrammar(grammar, lex, "parser");
fs.writeFileSync('../parser.js', source);
console.log("success");
