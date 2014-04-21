var fs = require('fs');
var stream = fs.createReadStream('./test.png');

stream.on('data', function(data) {
  console.log('loaded part of the file \n');
  console.log(data);
});

stream.on('end', function() {
  console.log('all parts is loaded');
});

stream.on('error', function(err) {
  console.log('something is wrong :( ');
});
