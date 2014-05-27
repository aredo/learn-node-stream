var util = require('util');
var Transform = require('stream').Transform;

// ----------------------------------------------------------------------------

function Line2String() {
    Transform.call(this, { objectMode : true });
}
util.inherits(Line2String, Transform);

Line2String.prototype._transform = function(string, encoding, done) {
    // check this has a newline at the end
    if ( string.match(/\n$/) ) {
        this.push(string.replace(/\n$/, '').replace(/\\n/g, '\n').replace(/\\\\/g, '\\\\'));
    }
    else {
        // swallow this line since it's not valid
        done();
    }
    done();
};

// ----------------------------------------------------------------------------

module.exports = function () {
    return new Line2String();
};

// ----------------------------------------------------------------------------
