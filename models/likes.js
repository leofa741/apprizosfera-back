const { Schema, model } = require('mongoose');

const LikeSchema = Schema({

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

LikeSchema.methods.toJSON = function() {
    const { __v, ...like } = this.toObject();
    return like;
}

module.exports = model('Like', LikeSchema);
