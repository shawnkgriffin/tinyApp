//"uses strict"
//requires
const bodyParser = require("body-parser");
var express = require("express");
var cookieParser = require("cookie-parser");
var myDatabase = require("./database");

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





// GET /login - Login page for a user
// Posts /login for verification
app.get("/login", function(req, res) {
  //TODO should we be registering if we have an existing user? Maybe make them logout first
  let templateVars = {
    user: {
      id: "",
      email: ""
    },
    error: ""
  };
  res.render("pages/login", templateVars);
});

// POST /login - from form in header if user is not logged in
// Creates cookie for user
app.post("/login", (req, res) => {
  //TODO check parameters

  const userID = myDatabase.validUser(req.body.inputEmail, req.body.inputPassword);

  //TODO check that name is not empty
  if (!userID) {
    // delete the cookie
    res.clearCookie("id");
    let templateVars = {
      user: {
        id: "",
        email: ""
      },
      error: "Invalid email or password."
    };
    res.render("pages/login", templateVars);
    return;
  }
  let templateVars = {
    urls: urlDatabase,
    user: {
      id: userID,
      email: myDatabase.getEmail(userID)
    },
    error: ""
  };
  res.cookie("id", userID);

  res.render("pages/urls_index", templateVars);
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

  let userID = myDatabase.addUser( req.body.inputEmail, req.body.inputPassword);

  // Set the cookie
  res.cookie("id", userID);

  //Redict back to main page to show the user their URLs.
  res.redirect("/urls");
});

// GET /register - Add a new user
// returns a page with an email address and a password.
app.get("/register", function(req, res) {
  //TODO should we be registering if we have an existing user? Maybe make them logout first
  res.clearCookie("id");
  let templateVars = {
    user: {
      id: "",
      email: ""
    },
    error: ""
  };
  res.render("pages/register", templateVars);
});

// POST /login - login a user
app.post("/login", function(req, res) {
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
      res.status(400).send("Invalid password ");
      res.redirect("/login");
      return;
    }
  }

  //  TODO   check that the key is not a duplicate. or make that part of generateRandomString?
  let newuserID = generateRandomString(tinyURLLength);

  users[newuserID] = {
    id: newuserID,
    email: newEmail,
    password: newPassword
  };

  // Set the cookie
  res.cookie("id", newuserID);

  //Redict back to main page to show the user their URLs.
  res.redirect("/urls");
});

// Set up a router in front to redirect any pages to Login if you are not logged in.
app.use(function(req, res, next) {
  let userID = req.cookies["id"];
  if (userID) {
    console.log("Got next");
    next();
  } else {
    let templateVars = {
      user: {
        id: "",
        email: ""
      },
      error: ""
    };
    res.render("pages/login", templateVars);
  }
});

// GET HANDLERS
// use res.render to load up an ejs view file
// GET /
app.get("/", (req, res) => {
  // Cookies check
  console.log("Cookies: ", req.cookies.id);

  let templateVars = {
    urls: urlDatabase,
    user: {
      id: req.cookies["id"],
      email: myDatabase.getEmail(req.cookies["id"])
    }
  };

  // render to main page that shows all URLS
  res.render("pages/urls_index", templateVars);
});

// GET /URLS
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: {
      id: req.cookies["id"],
      email: myDatabase.getEmail(req.cookies["id"])
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
      email: myDatabase.getEmail(req.cookies["id"])
    }
  }

  res.render("pages/urls_new", templateVars);
});

//show the URL and allow the user to change the URL.
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: {
      id: req.cookies["id"],
      email: myDatabase.getEmail(req.cookies["id"])
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
      email: myDatabase.getEmail(req.cookies["id"])
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
      email: myDatabase.getEmail(req.cookies["id"])
    }
  };

  res.render("pages/about", templateVars);
});



// GET /logout - from any header
// Delete the cookie, go back to /urls
app.get("/logout", (req, res) => {
  //TODO check parameters

  console.log("logout");

  res.clearCookie("id");
  let templateVars = {
    user: {
      id: "",
      email: ""
    },
    error: "Logged out."
  };

  res.render("pages/login", templateVars);
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



app.listen(8080);
console.log("8080 is the magic port");
