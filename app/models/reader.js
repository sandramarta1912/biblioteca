const
	mongoose = require('mongoose'),
	mongoosePaginate = require('mongoose-paginate'),
	Schema = mongoose.Schema;

// create a schema
const readerSchema = new Schema({
	name: String,
	description: {
		type: String,
		unique: true
	},
	age: {
		type: Number,
		min: 10,
		max: 65

	}
});

// Middleware - make sure that the slug is created from the name
readerSchema.pre('save', function(next) {
	this.description = slugify(this.name);
	
	next();
});

readerSchema.plugin(mongoosePaginate);

// Create the model
const readerModel = mongoose.model('Reader', readerSchema);

// Export the model
module.exports = readerModel;

// Function to slugfy a name
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

