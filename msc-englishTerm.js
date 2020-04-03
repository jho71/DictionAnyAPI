
// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Entity schema

var englishTermSchema = new Schema({
 
  wordEnglish: { type: String, required: true, unique: true },
  wordNonEnglish: { type: String, default: '' },
  wordExpanded: { type: String, default: '' },
  languageCode: { type: String, required: true },
  image: { type: String, default: '' },
  imageType: { type: String, default: '' },
  audio: { type: String, default: '' },
  audioType: { type: String, default: '' },
  linkAuthoritative: { type: String, default: '' },
  linkWikipedia: { type: String, default: '' },
  linkYouTube: { type: String, default: '' },
  authorName: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now, required: true },
  dateRevised: { type: Date, default: Date.now, required: true },
  fieldOfStudy: { type: String, default: '' },
  helpYes: { type: Number, default: 0 },
  helpNo: { type: Number, default: 0 },

  definitions: [{
    authorName: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    definition: { type: String, required: true },
    quality: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  }]
  
});

// Make schema available to the application
module.exports = englishTermSchema;
