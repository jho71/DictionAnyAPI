
// ################################################################################
// Data service operations setup

const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Load the schemas...

// Data entities; the standard format is:
const englishTermSchema = require('./msc-englishTerm.js');
// Add others as needed
const nonEnglishTermSchema = require('./msc-nonEnglishTerm.js');



// ################################################################################
// Define the functions that can be called by server.js

module.exports = function () {

  // Collection properties, which get their values upon connecting to the database
  let englishTerms;
  let nonEnglishTerms;

  return {

    // ############################################################
    // Connect to the database

    connect: function () {
      return new Promise(function (resolve, reject) {

        // Create connection to the database
        console.log('Attempting to connect to the database...');

        // The following works for localhost...
        // Replace the database name with your own value
        mongoose.connect('mongodb+srv://dbUser:dbUserPassword@cluster0-9lzug.mongodb.net/BTI425_DB?retryWrites=true&w=majority', { connectTimeoutMS: 5000, useUnifiedTopology: true, useNewUrlParser: true });
                      // 'mongodb+srv://dbUser:<password>    @cluster0-9lzug.mongodb.net/<DATABASE>?retryWrites=true&w=majority'
        var db = mongoose.connection;
        // This one works for MongoDB Atlas...
        // (coming soon)

        // From https://mongoosejs.com/docs/connections.html
        // Mongoose creates a default connection when you call mongoose.connect(). 
        // You can access the default connection using mongoose.connection.
      
        // Handle connection events...
        // https://mongoosejs.com/docs/connections.html#connection-events
        // The data type of a connection event is string
        // And more than one connection event may be emitted during execution

        // FYI the Node.js EventEmitter class docs is here...
        // https://nodejs.org/api/events.html#events_class_eventemitter

        // Handle the unable to connect scenario
        // "on" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
        db.on('error', (error) => {
          console.log('Connection error:', error.message);
          reject(error);
        });

        // Handle the open/connected event scenario
        // "once" is a Node.js method in the EventEmitter class
        // https://nodejs.org/api/events.html#events_emitter_once_eventname_listener
        db.once('open', () => {
          console.log('Connection to the database was successful');
          englishTerms = db.model("terms-englishes", englishTermSchema,"terms-englishes")
          // Add others here...
          nonEnglishTerms = db.model("terms-otheres", nonEnglishTermSchema, "terms-otheres")
          resolve();
        });

       
      });
    },



    // ############################################################
    // englishTerm requests

    //GET
    englishTermGetAll: function () {
      return new Promise(function (resolve, reject) {

        // Fetch all documents
        // During development and testing, can "limit" the returned results to a smaller number
        // Remove that function call when deploying into production
        englishTerms.find()
          .sort({ wordEnglish: 'asc'})
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      })
    },
    //GET SOME
    englishTermGetByTerm: async function (text) {

      // URL decode the incoming value
      text = decodeURIComponent(text);

      // Attempt to find in the "name" field, case-insensitive
      let results = await englishTerms.find( { wordEnglish: { $regex: text, $options: "i" } });
      // This will find zero or more
      return results;
    },
    
     //GET ONE 
    englishTermGetById: function (itemId) {
      return new Promise(function (resolve, reject) {

        // Find one specific document
        englishTerms.findById(itemId, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }
        });
      })
    },
       //GET ONE 
    englishTermGetByTermOne: function (text) {
      return new Promise(function (resolve, reject) {
        // URL decode the incoming value
        //text = decodeURIComponent(text);

        // Attempt to find in the "name" field, case-insensitive
        var results = englishTerms.findOne({ wordEnglish : text});
        // This will find zero or more
        return resolve(results);
        // Find one specific document

      })
    },
    //POST
    englishTermAdd: function (newItem) {
      return new Promise(function (resolve, reject) {

        englishTerms.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      })
    },
    //PUT Definition
    englishTermNewDef: async function (newItem, id){

     let english = await englishTerms.findById(id);

     if(english){
      english.definitions.push(newItem);
      await english.save();
      return english;
     }
     else throw "Not Found"

    },
//PUT Increment HelpYes
    englishTermAddHelpYes: async function (id) {

        let english = await englishTerms.findById(id)
      
        if(english){
           
          english.helpYes++
          await english.save()
           return english
          }
        else 
          throw "Not Found"
    },//PUT Increment HelpNo
    englishTermAddHelpNo: async function (id) {

      let english = await englishTerms.findById(id)
    
      if(english){
         
        english.helpNo++
        await english.save()
         return english
        }
      else 
        throw "Not Found"
    },
    //PUT Increment Likes
    englishTermAddLikes: async function (defID) {
      return new Promise(function (resolve, reject) {
     
          englishTerms.findOneAndUpdate(
            {"definitions._id" : defID},
            {$inc : {"definitions.$.likes" : 1}},
            { new: true },
         (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }

        });
      })
    },
    //DELETE
    englishTermDelete: function (itemId) {
      return new Promise(function (resolve, reject) {

        englishTerms.findByIdAndRemove(itemId, (error) => {
          if (error) {
            // Cannot delete item
            return reject(error.message);
          }
          // Return success, but don't leak info
          return resolve();
        })
      })
    },

    nonEnglishTermGetAll: function () {
      return new Promise(function (resolve, reject) {
    
        // Fetch all documents
        // During development and testing, can "limit" the returned results to a smaller number
        // Remove that function call when deploying into production
        nonEnglishTerms.find()
          .sort({ wordEnglish: 'asc'})
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            // Found, a collection will be returned
            return resolve(items);
          });
      })
    },
    //GET SOME
    nonEnglishTermGetByTerm: async function (text) {
    
      // URL decode the incoming value
      text = decodeURIComponent(text);
    
      // Attempt to find in the "name" field, case-insensitive
      let results = await nonEnglishTerms.find( { wordEnglish: { $regex: text, $options: "i" } });
      // This will find zero or more
      return results;
    },

      //GET SOME BY ENGLISHTERMSID
      nonEnglishTermGetRelatedByEnglishId: async function (id) {
    
        // Attempt to find in the "name" field, case-insensitive
        let results = await nonEnglishTerms.find( { termEnglishId: id, });
        // This will find zero or more
        return results;
      },
     //GET ONE 
    nonEnglishTermGetById: function (itemId) {
      return new Promise(function (resolve, reject) {
    
        // Find one specific document
        nonEnglishTerms.findById(itemId, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }
        });
      })
    },
    //POST
    nonEnglishTermAdd: async function (newItem) {
      return new Promise(function (resolve, reject) {

        nonEnglishTerms.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      })
      // return new Promise(function (resolve, reject) {

      // let englishItemID
      // let itemID
      //   nonEnglishTerms.create(newItem, (error, item) => {
      //     if (error) {
      //       // Cannot add item
      //       return reject(error.message);
      //     }
      //   itemID = item._id
      //   });

      //     let english = await englishTerms.findOne({wordEnglish : newItem.wordEnglish})
      //     englishItemID = english._id
      
            
            
      //     let nonEnglish = await nonEnglishTerms.findByIdAndUpdate(itemID,{termEnglishId: englishItemID},{ new: true })

      //       return nonEnglish
    
        },
    //PUT Definition
    nonEnglishTermNewDef: async function (newItem, id){
    
     let nonEnglish = await nonEnglishTerms.findById(id);
    
     if(nonEnglish){
      nonEnglish.definitions.push(newItem);
      await nonEnglish.save();
      return nonEnglish;
     }
     else throw "Not Found"
    
    },
    //PUT Increment HelpYes
    nonEnglishTermAddHelpYes: async function (id) {
    
        let nonEnglish = await nonEnglishTerms.findById(id)
      
        if(nonEnglish){
           
          nonEnglish.helpYes++
          await nonEnglish.save()
           return nonEnglish
          }
        else 
          throw "Not Found"
    },//PUT Increment HelpNo
    nonEnglishTermAddHelpNo: async function (id) {
    
      let nonEnglish = await nonEnglishTerms.findById(id)
    
      if(nonEnglish){
         
        nonEnglish.helpNo++
        await nonEnglish.save()
         return nonEnglish
        }
      else 
        throw "Not Found"
    },
    //PUT Increment Likes
    nonEnglishTermAddLikes: async function (defID) {
      return new Promise(function (resolve, reject) {
     
          nonEnglishTerms.findOneAndUpdate(
            {"definitions._id" : defID},
            {$inc : {"definitions.$.likes" : 1}},
            { new: true },
         (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject('Not found');
          }
    
        });
      })
    },
    //DELETE
    nonEnglishTermDelete: function (itemId) {
      return new Promise(function (resolve, reject) {
    
        nonEnglishTerms.findByIdAndRemove(itemId, (error) => {
          if (error) {
            // Cannot delete item
            return reject(error.message);
          }
          // Return success, but don't leak info
          return resolve();
        })
      })
    }

  } // return statement that encloses all the function members

} // module.exports
