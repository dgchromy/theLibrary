const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");
const PORT = process.env.PORT || 3001;
//api routes 
const db = require("./client/models/");


// Use morgan logger for logging requests
app.use(logger("dev"));
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}


mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/googlebooksearch",
 { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false 
});

// Define API routes here

app.get("/api/books", (req,res) => {
  db.Book.find({},function(err, docs) {
    if (!err){ 
        res.json(docs)
    } else {throw err;}
});
})

app.post("/api/books/post",(req,res) =>{
  console.log("posted")
  db.Book.create(req.body)
  .catch((err)=>{res.json(err)})
})

app.delete("/api/books/:id",(req,res)=>{
  db.Book.deleteOne({_id: req.params.id}).then((err,data)=>{
    if(err){res.json(err)};
  })
})

// Send requests to API 
// If no API routes are hit, send the React app

// Define API routes before runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
})