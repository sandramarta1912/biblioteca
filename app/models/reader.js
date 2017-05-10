const mongoose = require('mongoose');
	Schema = mongoose.Schema;


// create a schema
const readerSchema = new Schema({
	name: String,
	description: {
		type: String,
		unique: true
	},
	age: String
});


//middleware----

//make sure that the slug is created from the name
readerSchema.pre('save', function(next) {
	this.description = slugfy(this.name);
	next();
});

// create the model

const readerModel = mongoose.model('Reader', readerSchema);




// export the model

module.exports = readerModel;

//function to slugfy a name
function slugfy(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

