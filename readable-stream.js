// node.js >= v0.10
var fs = require('fs');
var stream = fs.createReadStream('./input.mp4');
var writeStream = fs.createWriteStream('./output.mp4');

stream.on('readable', function() {
  // stream is ready to read
  var data = stream.read();

  console.log(data)

  writeStream.write(data);
});

stream.on('end', function() {
  writeStream.end();
});
