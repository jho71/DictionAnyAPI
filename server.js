
// ################################################################################
// Web service setup

const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
// Or use some other port number that you like better

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());



// ################################################################################
// Data model and persistent store setup

const manager = require("./manager.js");
const m = manager();
m.connect();


// ################################################################################
// Deliver the app's home page to browser clients

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});



// ################################################################################
// Resources available in this web API

app.get("/api", (req, res) => {
  // Here are the resources that are available for users of this web API...
  // YOU MUST EDIT THIS COLLECTION
  const links = [];
  // This app's resources...
  links.push({ "rel": "collection", "href": "/api/terms/english", "methods": "GET,POST" });
  // Example resources...
  links.push({ "rel": "collection", "href": "/api/terms/other", "methods": "GET,POST" });

  const linkObject = { 
    "apiName": "Web API A2",
    "apiDescription": "(add a brief description here)",
    "apiVersion": "1.0", 
    "apiAuthor": "John Ho",
    "links": links
  };
  res.json(linkObject);
});



// ################################################################################
// Request handlers for data entities (listeners)

// Get all
app.get("/api/terms/english", (req, res) => {
  // Call the manager method
  m.englishTermGetAll()
    .then((data) => {
      res.json(data);
      console.log(data)
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});
// Get Some (any by term case indescrimanent)
app.get("/api/terms/english/get-some/:englishTerm", (req, res) => {
  // Call the manager method
  m.englishTermGetByTerm(req.params.englishTerm)
    .then((data) => {
      res.json(data);
      console.log(data)
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});
// Get one
app.get("/api/terms/english/:id", (req, res) => {
  // Call the manager method
  m.englishTermGetById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
// Get all languages
app.get("/api/terms/languages", (req, res) => {
  // Call the manager method
  m.languagesGetAll()
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
// Get onn language name by language code
app.get("/api/terms/languages/convert-code/:id", (req, res) => {
  // Call the manager method
  m.languageGetOneByName(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
// Add new
app.post("/api/terms/english", (req, res) => {
  // Call the manager method
  m.englishTermAdd(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});

// // Edit existing
// app.put("/api/terms/english/:id", (req, res) => {
//   // Call the manager method
//   m.englishTermEdit(req.body)
//     .then((data) => {

//       res.json(data);
//     })
//     .catch(() => {
//       res.status(404).json({ "message": "Resource not found" });
//     })
// });
// Edit existing definition
app.put("/api/terms/english/:id/add-definition", (req, res) => {
  // Call the manager method
  m.englishTermNewDef(req.body, req.params.id)
    .then((data) => {
      console.log(data)
      res.json(data);
      
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
//Edit increment helpYes
app.put("/api/terms/english/helpyes/:id", (req, res) => {
  // Call the manager method
  m.englishTermAddHelpYes(req.params.id)
    .then((data) => {
      res.json(data);
    
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
//Edit increment helpNo
app.put("/api/terms/english/helpno/:id", (req, res) => {
  // Call the manager method
  m.englishTermAddHelpNo(req.params.id)
    .then((data) => {
      res.json(data);
      
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
//Edit increment likes
app.put("/api/terms/english/definition-like/:id", (req, res) => {
  // Call the manager method
  m.englishTermAddLikes(req.params.id)
    .then((data) => {
      res.json(data);
      
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
// Delete item
app.delete("/api/terms/english/:id", (req, res) => {
  // Call the manager method
  m.englishTermDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
// Get all
app.get("/api/terms/other", (req, res) => {
  // Call the manager method
  m.nonEnglishTermGetAll()
    .then((data) => {
      res.json(data);
      console.log(data)
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});
// Get Some (by english id search through englishTermsId)
app.get("/api/terms/other/get-some-related/:englishId", (req, res) => {
  // Call the manager method
  m.nonEnglishTermGetRelatedByEnglishId(req.params.englishId)
    .then((data) => {
      res.json(data);
      console.log(data)
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});
// Get Some (any by term case indescrimanent)
app.get("/api/terms/other/get-some/:nonEnglishTerm", (req, res) => {
  // Call the manager method
  m.nonEnglishTermGetByTerm(req.params.nonEnglishTerm)
    .then((data) => {
      res.json(data);
      console.log(data)
    })
    .catch((error) => {
      res.status(500).json({ "message": error });
    })
});
// Get one
app.get("/api/terms/other/:id", (req, res) => {
  // Call the manager method
  m.nonEnglishTermGetById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});

// Add new
app.post("/api/terms/other", (req, res) => {
  // Call the manager method
  // m.englishTermGetByTermOne(req.body.wordEnglish).then(related =>{
  // req.body.termEnglishId = related._id

  m.nonEnglishTermAdd(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ "message": error 
    });
  })
  
   })
// });

// // Edit existing
// app.put("/api/terms/other/:id", (req, res) => {
//   // Call the manager method
//   m.nonEnglishTermEdit(req.body)
//     .then((data) => {

//       res.json(data);
//     })
//     .catch(() => {
//       res.status(404).json({ "message": "Resource not found" });
//     })
// });
// Edit existing definition
app.put("/api/terms/other/:id/add-definition", (req, res) => {
  // Call the manager method
  m.nonEnglishTermNewDef(req.body, req.params.id)
    .then((data) => {
      console.log(data)
      res.json(data);
      
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
//Edit increment helpYes
app.put("/api/terms/other/helpyes/:id", (req, res) => {
  // Call the manager method
  m.nonEnglishTermAddHelpYes(req.params.id)
    .then((data) => {
      res.json(data);
    
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
//Edit increment helpNo
app.put("/api/terms/other/helpno/:id", (req, res) => {
  // Call the manager method
  m.nonEnglishTermAddHelpNo(req.params.id)
    .then((data) => {
      res.json(data);
      
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
//Edit increment likes
app.put("/api/terms/other/definition-like/:defID", (req, res) => {
  // Call the manager method
  m.nonEnglishTermAddLikes(req.params.defID)
    .then((data) => {
      res.json(data);
      
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});
// Delete item
app.delete("/api/terms/other/:id", (req, res) => {
  // Call the manager method
  m.nonEnglishTermDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(404).json({ "message": "Resource not found" });
    })
});





// ################################################################################
// Resource not found (this should be at the end)

app.use((req, res) => {
  res.status(404).send("Resource not found");
});



// ################################################################################
// Attempt to connect to the database, and
// tell the app to start listening for requests

m.connect().then(() => {
  app.listen(HTTP_PORT, () => { console.log("Ready to handle requests on port " + HTTP_PORT) });
})
  .catch((err) => {
    console.log("Unable to start the server:\n" + err);
    process.exit();
  });
