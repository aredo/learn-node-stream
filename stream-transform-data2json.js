var util = require('util');
var Transform = require('stream').Transform;

// ----------------------------------------------------------------------------

function Data2Json() {
    Transform.call(this, { objectMode : true });
}
util.inherits(Data2Json, Transform);

Data2Json.prototype._transform = function(data, encoding, done) {
    try {
        var json = JSON.stringify(data);
        this.push(json);
        done();
    }
    catch (e) {
        return done(e);
        // swallow this error
        done();
    }
};

// ----------------------------------------------------------------------------

module.exports = function () {
    return new Data2Json();
};

// ----------------------------------------------------------------------------
