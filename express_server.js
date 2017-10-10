var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

var urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let templateVars = { urls: urlDatabase };
for (let item in templateVars.urls) {
  console.log(item, urlDatabase[item]);
}

// set the view engine to ejs
app.set("view engine", "ejs");
// use res.render to load up an ejs view file


app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("pages/urls_index", templateVars);
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
