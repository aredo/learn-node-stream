var fs          = require('fs');
var request     = require('request');
var gzip        = require('zlib').createGzip();

var stream      = request('https://s3.amazonaws.com/ooomf-com-files/RpgvvtYAQeqAIs1knERU_vegetables.jpg');
var writeStream = fs.createWriteStream('./test-gzip.jpg');

// write gzipped image file
stream.pipe(gzip).pipe(writeStream);
