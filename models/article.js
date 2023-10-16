const { Schema, model } = require('mongoose');

const ArticleSchema = Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio']
    },
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

    img: {
        type: String
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    }],

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

  
// Sobreescribir el método toJSON

ArticleSchema.methods.toJSON = function() {
    const { __v, ...article } = this.toObject();
    return article;
}

module.exports = model('Article', ArticleSchema);






