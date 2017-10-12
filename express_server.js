//"uses strict"
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

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
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
    user: {
      id: req.cookies["id"],
      email: req.cookies["email"],
      // TODO check to see whether we should be passing the password?
      password: req.cookies["password"]
    }
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
    user: {
      id: req.cookies["id"],
      email: req.cookies["email"],
      // TODO check to see whether we should be passing the password?
      password: req.cookies["password"]
    }
  };
  res.render("pages/urls_index", templateVars);
});

// GET URLS/NEW
// User wants to get a new small URL
app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: {
      id: req.cookies["id"],
      email: req.cookies["email"],
      // TODO check to see whether we should be passing the password?
      password: req.cookies["password"]
    }
  };

  res.render("pages/urls_new", templateVars);
});

//show the URL and allow the user to change the URL.
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: {
      id: req.cookies["id"],
      email: req.cookies["email"],
      // TODO check to see whether we should be passing the password?
      password: req.cookies["password"]
    }
  };
  res.render("pages/urls_show", templateVars);
});

//Delete the URL at shortURL :id
app.get("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;

  // TODO check to see what happens if URL not there and handle
  delete urlDatabase[shortURL];
  let templateVars = {
    urls: urlDatabase,
    user: {
      id: req.cookies["id"],
      email: req.cookies["email"],
      // TODO check to see whether we should be passing the password?
      password: req.cookies["password"]
    }
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
    user: {
      id: req.cookies["id"],
      email: req.cookies["email"],
      // TODO check to see whether we should be passing the password?
      password: req.cookies["password"]
    }
  };

  res.render("pages/about", templateVars);
});

// GET /register - Add a new user
// returns a page with an email address and a password.
app.get("/register", function(req, res) {
  //TODO should we be registering if we have an existing user? Maybe make them logout first
  let templateVars = {
    user: {
      id: req.cookies["id"],
      email: req.cookies["email"],
      // TODO check to see whether we should be passing the password?
      password: req.cookies["password"]
    }
  };
  res.render("pages/register", templateVars);
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

// POST /logout - from any header
// Delete the cookie, go back to /urls
app.post("/logout", (req, res) => {
  //TODO check parameters

  console.log("logout");
  //TODO check that current cookie is not empty
  
  res.clearCookie("id");
  res.clearCookie("password");
  res.clearCookie("email");

  res.redirect("/urls");
});

// POST /register - Add a new user
// returns a page with an email address and a password.
app.post("/register", function(req, res) {
  let newEmail = req.body.inputEmail;
  let newPassword = req.body.inputPassword;

  // If the e-mail or password are empty strings, send back a response with the 400 status code.
  if (!newEmail || !newPassword) {
    res
      .status(400)
      .send(
        !newEmail
          ? "You need a valid email address."
          : "You must enter a password."
      );
    return;
  }

  //TODO If someone tries to register with an existing user's email, send back a response with the 400 status code.
  for (const key in users) {
    if (users[key].email == newEmail) {
      res.status(400).send("Duplicate email address.");
      return;
    }
  }

  //  TODO   check that the key is not a duplicate. or make that part of generateRandomString?
  let newUserID = generateRandomString(tinyURLLength);

  users[newUserID] = {
    id: newUserID,
    email: newEmail,
    password: newPassword
  };

  // Set the cookie
  res.cookie("id", newUserID);
  res.cookie("email", newEmail);
  res.cookie("password", newPassword);

  //Redict back to main page to show the user their URLs.
  res.redirect("/urls");
});

app.listen(8080);
console.log("8080 is the magic port");
