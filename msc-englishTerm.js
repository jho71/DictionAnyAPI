
// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Entity schema

var englishTermSchema = new Schema({
  wordEnglish: {type: String, required: true, unique: true},
  wordNonEnglish: String,
  wordExpanded: String,
  languageCode: String,
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
    definitions: [{
    authorName: String,
    dateCreated: {type: Date, default: Date.now},
    definition: String,
    quality: Number,
    likes: Number
    }]
  //  ,termEnglishId: String
});

// Make schema available to the application
module.exports = englishTermSchema;
