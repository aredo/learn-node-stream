var fs = require('fs');
var readline = require('readline2');
var stream = require('stream');

var instream = fs.createReadStream('linebyline.txt', 'utf8');

var outstream = new stream;

var rl = readline.createInterface(instream, outstream)

var obj = {}

rl.on('line', function (line) {
  console.log(line);
  var lines = line.split(',')
  obj[lines[0]] = lines[1];
})


rl.on('close', function (line) {
  console.log(JSON.stringify(obj))
})
