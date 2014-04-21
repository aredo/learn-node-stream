var fs      = require('fs');
var request = require('request');
var crypto  = require('crypto')

var stream      = request('https://s3.amazonaws.com/ooomf-com-files/8jLdwLg6TLKIQfJcZgDb_Freedom_5.jpg');
var writeStream = fs.createWriteStream('./output.jpg')

stream.on('data', function(data) {
  console.log(data)
  writeStream.write(data)
});

stream.on('end', function() {
  console.log("==============================")
  console.log('done')
  writeStream.end();
});

stream.on('error', function(err) {
  console.log('something is wrong :( ');
  writeStream.close();
});
