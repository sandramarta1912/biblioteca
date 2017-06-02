const
	mongoose = require('mongoose'),
	mongoosePaginate = require('mongoose-paginate'),
	Schema = mongoose.Schema;

// create a schema
const bookSchema = new Schema({
	name: String,
	description: {
		type: String,
		unique: true
	},
	author:  {
		type: String

	},
	about: String
});

// Middleware - make sure that the slug is created from the name
bookSchema.pre('save', function(next) {
	this.description = slugify(this.name);
	next();
});

bookSchema.plugin(mongoosePaginate);

// create the model
const bookModel = mongoose.model('Book', bookSchema);

// export the model
module.exports = bookModel;

//function to slugfy a name
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

