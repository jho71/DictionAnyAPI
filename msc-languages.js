var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Entity schema

var languagesSchema = new Schema({
 
   code : String,
   name : String

});

// Make schema available to the application
module.exports = languagesSchema;