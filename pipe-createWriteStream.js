var fs = require('fs');
var request = require('request');

var stream      = request('https://s3.amazonaws.com/ooomf-com-files/8jLdwLg6TLKIQfJcZgDb_Freedom_5.jpg');
var writeStream = fs.createWriteStream('./testimg.jpg');

stream.pipe(writeStream);
