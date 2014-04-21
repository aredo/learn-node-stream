// node.js >= v0.10
var fs = require('fs');

var stream      = fs.createReadStream('./test.png');
var writeStream = fs.createWriteStream('./output.png');

var writable = true;
var doRead = function() {
  var data = stream.read();
  // when writable return false, it means the buffer is full.
  writable = writeStream.write(data);
}

stream.on('readable', function() {
  if(writable) {
    doRead()
  } else {
    // wait for drain event if stream buffer is full
    writeStream.removeAllListeners('drain');
    writeStream.once('drain', doRead)
  }
});

stream.on('end', function() {
  writeStream.end();
});

stream.on('error', function(err) {
  console.log('something is wrong :( ');
  writeStream.close();
});

