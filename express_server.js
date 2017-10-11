//requires and globals
const bodyParser = require("body-parser");
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const tinyURLLength = 6;

// Temporary database.
var urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Functions and other worker items remember to refactor these to a module.

// generate 6 random alphanumeric characters
function generateRandomString(length) {
  const validChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let random = "";
  for (let i = 0; i < length; i++) {
    random += validChars[Math.floor(Math.random() * validChars.length)];
  }
  return random;
}

// set the view engine to ejs
app.set("view engine", "ejs");

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));

// use res.render to load up an ejs view file

app.get("/", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("pages/urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("pages/urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
});

app.post("/urls", (req, res) => {
  const key = generateRandomString(tinyURLLength);
  urlDatabase[key] = "http://" + req.body.longURL;

  res.redirect("/urls/" + key);
});

//change a Long URL
app.post("/urls/:id/change", (req, res) => {
  urlDatabase[req.params.id] = req.body.newLongURL;

  res.redirect("/");
});

//show
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id]
  };
  res.render("pages/urls_show", templateVars);
});

//Delete the URL at shortURL
app.get("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  delete urlDatabase[shortURL];
  let templateVars = { urls: urlDatabase };
  res.render("pages/urls_index", templateVars);
});

// What would happen if a client requests a non-existent shortURL?
// What happens to the urlDatabase when the server is restarted?
// Should your redirects be 301 or 302 - What is the difference?
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// about page
app.get("/about", function(req, res) {
  res.render("pages/about");
});

app.listen(8080);
console.log("8080 is the magic port");
