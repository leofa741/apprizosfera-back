const { Schema, model } = require('mongoose');

const DislikeSchema = Schema({

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: false
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },

});

DislikeSchema.methods.toJSON = function() {
    const { __v, ...dislike } = this.toObject();
    return dislike;
}

module.exports = model('Dislike', DislikeSchema);

