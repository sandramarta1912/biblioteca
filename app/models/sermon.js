const
    mongodb = require('mongodb'),
    mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

// create a schema
const sermonSchema = new Schema({
    title: {
        type: String
    },
    slug: {
        type: String,
        unique: true
    },
    // preacher: [{}],
    date: {
        type: Date
    },
    duration: {
        type: Number
    },
    schetch_notes: {
        type: String,
        filePath: true
    }


});

// Middleware - make sure that the slug is created from the name
sermonSchema.pre('save', function(next) {
    this.slug = slugify(this.title);
    next();
});

sermonSchema.plugin(mongoosePaginate);

// create the model
const sermonModel = mongoose.model('Sermon', sermonSchema);

// export the model
module.exports = sermonModel;

//function to slugfy a name
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

