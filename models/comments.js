const { Schema, model } = require('mongoose');

const CommentSchema = Schema({

    content: {
        type: String,
        required: [true, 'El contenido es obligatorio']
    },
    date: {
        type: Date,
        default: Date.now
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Like',
        required: false
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'Dislike',
        required: false
    }],   

});

CommentSchema.methods.toJSON = function() {
    const { __v, ...comment } = this.toObject();
    return comment;
}

module.exports = model('Comment', CommentSchema);


