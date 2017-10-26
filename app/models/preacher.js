const
    mongodb = require('mongodb'),
    mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

// create a schema
const preacherSchema = new Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    sermons: [{type: ObjectId, ref:'sermon1'}],
    most_recent_sermon_date: {
        dateTime : date
    }
});

// Middleware - make sure that the slug is created from the name
preacherSchema.pre('save', function(next) {
    this.slug = slugify(this.name);
    next();
});

preacherSchema.plugin(mongoosePaginate);

// create the model
const preacherModel = mongoose.model('Book', preacherSchema);

// export the model
module.exports = preacherModel;

//function to slugfy a name
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

