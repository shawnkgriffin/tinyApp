//requires
const bodyParser = require("body-parser");
var express = require("express");
var cookieParser = require("cookie-parser");

//start up express, set up the components we are using.
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// set the view engine to ejs
app.set("view engine", "ejs");

var PORT = process.env.PORT || 8080; // default port 8080

//GLOBALS
// Temporary database.
const tinyURLLength = 6;
var urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Functions and other worker items remember to refactor these to a module.

// generate length random alphanumeric characters
function generateRandomString(length) {
  const validChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let random = "";
  for (let i = 0; i < length; i++) {
    random += validChars[Math.floor(Math.random() * validChars.length)];
  }
  return random;
}

// GET HANDLERS
// use res.render to load up an ejs view file
// GET /
app.get("/", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };

  // Cookies check
  console.log("Cookies: ", req.cookies);

  // render to main page that shows all URLS
  res.render("pages/urls_index", templateVars);
});

// GET /URLS
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("pages/urls_index", templateVars);
});

// GET URLS/NEW
// User wants to get a new small URL
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  
  res.render("pages/urls_new", templateVars);
});

//show the URL and allow the user to change the URL.
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("pages/urls_show", templateVars);
});

//Delete the URL at shortURL
app.get("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  delete urlDatabase[shortURL];
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("pages/urls_index", templateVars);
});

//GET /u/:shortURL do the redirection to the longURL
app.get("/u/:shortURL", (req, res) => {
  //TODO Check parameters
  // What would happen if a client requests a non-existent shortURL?
  // What happens to the urlDatabase when the server is restarted?
  // Should your redirects be 301 or 302 - What is the difference?

  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// GET /about - Added an About page for fun.
app.get("/about", function(req, res) {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render("pages/about", templateVars);
});


// POSTS

// POST /urls when we get a new tiny URL from /urls/new
// create a random string (key) then redirect to /urls/key to allow user to view or change.
app.post("/urls", (req, res) => {
  const key = generateRandomString(tinyURLLength);
  urlDatabase[key] = "http://" + req.body.longURL;

  res.redirect("/urls/" + key);
});

// POST /urls/:id/change when we change a URL from urls/:id
// change the Long URL to point to the new one.
app.post("/urls/:id/change", (req, res) => {
  
  //TODO check parameters verify that req.params.id is valid
  urlDatabase[req.params.id] = req.body.newLongURL;

  res.redirect("/");
});

// POST /login - from form in header if user is not logged in
// Creates cookie for user
app.post("/login", (req, res) => {
  //TODO check parameters

  //TODO check that name is not empty
  res.cookie("username", req.body.userID);

  res.redirect("/urls");
});


app.listen(8080);
console.log("8080 is the magic port");
