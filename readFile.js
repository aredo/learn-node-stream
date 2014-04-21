var fs = require('fs');

fs.readFile('./test.json', function(data, err){
  if (err) {
    return console.log(err);
  }

  console.log('test file is loaded:\n', data);
});
