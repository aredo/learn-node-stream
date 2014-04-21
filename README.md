## Understand Node.JS Stream

#### Node.js stream

Node.js provides asynchronous I/O base on event loop. When reading and writing from filesystem or sending http request, Node.js can process other events when waiting for response, which we called it non-blocking I/O. Stream is an extend of this concept, it provides an event base I/O interface to save memory buffers and bandwidth.

#### Event Based I/O

When reading from filesystem, node provides non-blocking method with callback:

```javascript
var fs = require('fs');

fs.readFile('./test.json', function(data, err){
  if (err) {
    return console.log(err);
  }

  console.log('test file is loaded:\n', data);
});

```
However, for large file we may want to do something before the file is completely loaded to save memory buffer. This is where stream comes in:

```javascript
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

```

Basically a read stream is an EventEmitter with ‘data’, ‘end’ and ‘error’ event.

- ‘data’ event return the part of file.
- ‘end’ event is called when read finished.
- ‘error’ event is called when error happened

So we can write or process part of the file, but no need to wait until the whole file is loaded. For example, when we request a file from internet:

```javascript
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


```

This will write the data to file when it receive part of the data.

#### Pipe

Pipe is another concept that can let you redirect input to output. The above download file code can be present with pipe:

```javascript
var fs = require('fs');
var request = require('request');

var stream      = request('https://s3.amazonaws.com/ooomf-com-files/8jLdwLg6TLKIQfJcZgDb_Freedom_5.jpg');
var writeStream = fs.createWriteStream('./testimg.jpg');

stream.pipe(writeStream);

```

What pipe function do is, it connect the read and write events between streams, and return another pipe. So we can even chaining multiple pipes together:


```javascript
var fs          = require('fs');
var request     = require('request');
var gzip        = require('zlib').createGzip();

var stream      = request('https://s3.amazonaws.com/ooomf-com-files/RpgvvtYAQeqAIs1knERU_vegetables.jpg');
var writeStream = fs.createWriteStream('./test-gzip.jpg');

// write gzipped image file
stream.pipe(gzip).pipe(writeStream);