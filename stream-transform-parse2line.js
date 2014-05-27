var util = require('util');
var Transform = require('stream').Transform;

// ----------------------------------------------------------------------------

function Parse2Line() {
    Transform.call(this, { objectMode : true });
    this._buffer = '';
}
util.inherits(Parse2Line, Transform);

Parse2Line.prototype._transform = function(data, encoding, done) {
    var str;
    var lines;
    var i;

    if ( encoding === 'buffer' ) {
        data = data.toString('utf8');
        encoding = 'utf8';
    }

    if ( data.match(/\n/) ) {
        str = this._buffer + data;
        lines = str.split("\n");
        for ( i = 0 ; i < lines.length - 1; i++ ) {
            this.push(lines[i] + "\n");
        }

        // save the last one until the end
        this._buffer = lines[lines.length];
    }
    else {
        this._buffer += data;
    }

    done();
};

// ----------------------------------------------------------------------------

module.exports = function() {
    return new Parse2Line();
};

// ----------------------------------------------------------------------------
