var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Entity schema

var userAccountSchema = new Schema({

   userName : {type: String, unique: true},
   fullName: {type: String, required: true},
   password: {type: String, required: true},
   passwordConfirm: {type: String, required: true}, 
   statusActivated: Boolean,
   statusLocked: Boolean,
   roles: [String], 
   claims: [{ type : {type: String}, value : {type : String} }]

});

module.exports = userAccountSchema;
