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