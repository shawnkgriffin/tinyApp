//requires and globals
const bodyParser = require("body-parser");
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const tinyURLLength = 6;

// Temporary database.
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Functions and other worker items remember to refactor these to a module.

// generate 6 random alphanumeric characters
function generateRandomString(length) {
  const validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let random = "";
  for (let i = 0; i < length; i++) {
    random  += validChars[Math.floor(Math.random() * validChars.length)];
  }
  return random;
  }


// set the view engine to ejs
app.set("view engine", "ejs");

// use body parser
app.use(bodyParser.urlencoded({extended: true}));

// use res.render to load up an ejs view file

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("pages/urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  const key = generateRandomString(tinyURLLength);
  urlDatabase[key]  = "http://" + req.body.longURL;
  //res.send("Ok"); 
  res.redirect('/urls/'+ key );        // Respond with 'Ok' (we will replace this)
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id
  };
  res.render("pages/urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// index page
app.get("/", (req, res) => {
  var drinks = [
    { name: "Bloody Mary", drunkness: 3 },
    { name: "Martini", drunkness: 5 },
    { name: "Scotch", drunkness: 10 }
  ];
  var tagline =
    "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

  res.render("pages/index", {
    drinks: drinks,
    tagline: tagline
  });
});
// about page
app.get("/about", function(req, res) {
  res.render("pages/about");
});

app.listen(8080);
console.log("8080 is the magic port");
