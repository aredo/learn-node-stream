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



#### Stream2 (Readable and Writable stream)

One problem of the ‘data’ event based stream is the stream consumer can’t control the timimg of read and how much data to read each times. When data event is triggered, handler function need to store the data into buffer or write it to disk right away. That becomes a problem when we have slow or limited write I/O.

Therefore, in node.js v0.10. It introduce the new stream interface, called stream2.

It provides 2 new stream classes:

#### Readable Stream

Readable stream extend the old stream interface with new ‘readable’ event, which let the consumer control the timing of read and how many bytes to read.

```javascript
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

```

So when readable event is triggered, the consumer control to call the ``` stream.read() ``` to read the data. if the data is not read, readable event will be throwed back to eventloop and be triggered later.

The Readable stream is also backward competable, so when ‘data’ event is listened. Stream will not use readable event but downgrade to old stream behavior.


#### Writable Stream

Writable stream added new ‘drain’ event, which will be triggered when all data in buffer is written. So we can control the timing to write when the buffer is empty.

```javacript
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

```