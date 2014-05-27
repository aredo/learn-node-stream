var util = require('util');
var Transform = require('stream').Transform;

// ----------------------------------------------------------------------------

function Json2Data() {
    Transform.call(this, { objectMode : true });
}
util.inherits(Json2Data, Transform);

Json2Data.prototype._transform = function(json, encoding, done) {
    try {
        var data = JSON.parse(json);
        this.push(data);
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
    return new Json2Data();
};

// ----------------------------------------------------------------------------
