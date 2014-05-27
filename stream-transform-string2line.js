var util = require('util');
var Transform = require('stream').Transform;

// ----------------------------------------------------------------------------

function String2Line() {
    Transform.call(this, { objectMode : true });
}
util.inherits(String2Line, Transform);

String2Line.prototype._transform = function(string, encoding, done) {
    this.push(string.replace(/\\/g, '\\').replace(/\n/g, '\\n') + "\n");
    done();
};

// ----------------------------------------------------------------------------

module.exports = function () {
    return new String2Line();
};

// ----------------------------------------------------------------------------
