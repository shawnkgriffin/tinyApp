//"uses strict"
//requires
const bodyParser = require("body-parser");
var cookieSession = require("cookie-session");
var express = require("express");
var myDatabase = require("./database");

//start up express, set up the components we are using.
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// set the view engine to ejs
app.set("view engine", "ejs");

var PORT = process.env.PORT || 8080; // default port 8080

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

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
// POST /login - login a user
app.post("/login", function(req, res) {
  let newUserID = myDatabase.validUser(
    req.body.inputEmail,
    req.body.inputPassword
  );
  // If the e-mail or password are empty strings, send back a response with the 400 status code.
  if (!newUserID) {
    let templateVars = {
      user: {
        id: "",
        email: ""
      },
      error: "You need a valid email address and password to login."
    };
    res.render("pages/login", templateVars);
    return;
  }
  let templateVars = {
    urls: myDatabase.getURLS(newUserID),
    user: {
      id: newUserID,
      email: myDatabase.getEmail(newUserID)
    },
    error: ""
  };
  //res.cookie("id", newUserID);
  req.session.userID = newUserID;

  res.render("pages/urls_index", templateVars);
});

// POST /register - Add a new user
// returns a page with an email address and a password.
app.post("/register", function(req, res) {
  let newUserID = myDatabase.addUser(
    req.body.inputEmail,
    req.body.inputPassword
  );
  if (!newUserID) {
    let templateVars = {
      user: {
        id: "",
        email: ""
      },
      error: "Cannot register again, please login."
    };
    res.render("pages/login", templateVars);
    return;
  }
  // Set the cookie
  //res.cookie("id", newuserID);
  req.session.userID = newUserID;
  
  //Redict back to main page to show the user their URLs.
  res.redirect("/urls");
});

// GET /register - Add a new user
// returns a page with an email address and a password.
app.get("/register", function(req, res) {
  //TODO should we be registering if we have an existing user? Maybe make them logout first
  //check to see if we should force the user to logout if there is an existing cookie.
  let templateVars = {
    user: {
      id: "",
      email: ""
    },
    error: ""
  };
  res.render("pages/register", templateVars);
});

// Set up a router in front to redirect any pages to Login if you are not logged in.
// app.use(function(req, res, next) {
//   let userID = req.session.userID;
//   if (userID) {
//     console.log("Got next");
//     next();
//   } else {
//     let templateVars = {
//       user: {
//         id: "",
//         email: ""
//       },
//       error: ""
//     };
//     res.render("pages/login", templateVars);
//   }
// });

// GET HANDLERS
// use res.render to load up an ejs view file
// GET /
app.get("/", (req, res) => {
  // Cookies check
  console.log("Cookies: ", req.session.userID);

  let templateVars = {
    urls: myDatabase.getURLS(req.session.userID),
    user: {
      id: req.session.userID,
      email: myDatabase.getEmail(req.session.userID)
    }
  };

  // render to main page that shows all URLS
  res.render("pages/urls_index", templateVars);
});

// GET /URLS
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: myDatabase.getURLS(req.session.userID),
    user: {
      id: req.session.userID,
      email: myDatabase.getEmail(req.session.userID)
    }
  };
  res.render("pages/urls_index", templateVars);
});

// GET URLS/NEW
// User wants to get a new small URL
app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: myDatabase.getURLS(req.session.userID),
    user: {
      id: req.session.userID,
      email: myDatabase.getEmail(req.session.userID)
    }
  };

  res.render("pages/urls_new", templateVars);
});

//show the URL and allow the user to change the URL.
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: myDatabase.getLongURL(req.session.userID, req.params.id),
    user: {
      id: req.session.userID,
      email: myDatabase.getEmail(req.session.userID)
    }
  };
  res.render("pages/urls_show", templateVars);
});

//Delete the URL at shortURL :id
app.get("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;

  // TODO check to see what happens if URL not there and handle
  myDatabase.deleteShortURL(req.session.userID, shortURL);

  let templateVars = {
    urls: myDatabase.getURLS(req.session.userID),
    user: {
      id: req.session.userID,
      email: myDatabase.getEmail(req.session.userID)
    }
  };

  res.render("pages/urls_index", templateVars);
});

// GET /about - Added an About page for fun.
app.get("/about", function(req, res) {
  let templateVars = {
    user: {
      id: req.session.userID,
      email: myDatabase.getEmail(req.session.userID)
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

//GET /:shortURL do the redirection to the longURL
app.get("/:shortURL", (req, res) => {
  //TODO Check parameters
  // What would happen if a client requests a non-existent shortURL?
  // What happens to the urlDatabase when the server is restarted?
  // Should your redirects be 301 or 302 - What is the difference?

  let longURL = myDatabase.getLongURL("", req.params.shortURL);
  res.redirect(longURL);
});
// POSTS

// POST /urls when we get a new tiny URL from /urls/new
// create a random string (key) then redirect to /urls/key to allow user to view or change.
app.post("/urls", (req, res) => {
  const myShortURL = myDatabase.createShortURL(
    req.session.userID,
    req.body.longURL
  );

  res.redirect("/");
});

// POST /urls/:id/change when we change a URL from urls/:id
// change the Long URL to point to the new one.
app.post("/urls/:id/change", (req, res) => {
  //TODO check parameters verify that req.params.id is valid
  myDatabase.updateShortURL(
    req.session.userID,
    req.params.id,
    req.body.newLongURL
  );

  res.redirect("/");
});

app.listen(8080);
console.log("8080 is the magic port");
