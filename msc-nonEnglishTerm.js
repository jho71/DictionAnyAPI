
// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Entity schema

var nonEnglishTermSchema = new Schema({
  wordEnglish:  {type: String, required: true},
  wordNonEnglish:{type: String, required: true, unique: true},
  wordExpanded: String,
  languageCode: {type: String, required: true},
  image: String,
  imageType: String,
  audio: String,
  audioType: String,
  linkAuthoritative: String,
  linkWikipedia: String,
  linkYouTube: String,
  authorName: String,
  dateCreated: {type: Date, default: Date.now},
  dateRevised:  {type: Date, default: Date.now},
  fieldOfStudy: String,
  helpYes: Number,
  helpNo: Number,
  termEnglishId: {  type: Schema.Types.ObjectId, ref: 'terms-english'},
    definitions: [{
    authorName: String,
    dateCreated: {type: Date, default: Date.now},
    definition: String,
    quality: Number,
    likes: Number
    }]
   
});

// Make schema available to the application
module.exports = nonEnglishTermSchema;
