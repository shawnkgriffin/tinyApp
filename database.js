const bcrypt = require("bcrypt");

//CONSTANTS

//GLOBALS
// Temporary database.
const tinyURLLength = 6;
var urlDatabase = {
  b2xVn2: {
    shortURL : "b2xVn2",
    longURL: "http://www.lighthouselabs.ca",
    userID: "asdfas",
    dateCreated : new Date(2017, 9, 24, 8, 45),
    totalHits : 0,
    ownerHits : 0
  },
  "9sm5xK": {
    shortURL : "9sm5xK",
    longURL: "http://www.google.com",
    userID: "userRandomID",
    dateCreated : new Date(1991, 9, 24, 8, 45),
    totalHits : 0,
    ownerHits : 0
  },
  ssddd: {
    shortURL : "ssddd",
    longURL: "http://www.google.com",
    userID: "asdfas",
    dateCreated : new Date(1993, 11, 15, 8, 45),
    totalHits : 0,
    ownerHits : 0
  }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
  asdfas: {
    id: "asdfas",
    email: "shawn@shawngriffin.com",
    password: bcrypt.hashSync("shawn", 10)
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

//  TODO   check that the key is not a duplicate. or make that part of generateRandomString?
function addUser(newEmail, newPassword) {
  for (const key in users) {
    if (users[key].email == newEmail) {
      return "";
    }
  }
  const newuserID = generateRandomString(tinyURLLength);
  const hash = bcrypt.hashSync(newPassword, 10);

  users[newuserID] = {
    id: newuserID,
    email: newEmail,
    password: hash
  };

  return newuserID;
}

//Get a valid userID from email and password
// (email, password) => userID (string) undefined if not found.

function validUser(email, password) {
  for (let key in users) {
    if (users[key].email == email) {
      if (bcrypt.compareSync(password, users[key].password)) {
        return users[key].id;
      }
    }
  }
  return "";
}

//Get a email from userID
// (userID) => email (string) undefined if not found.

function getEmail(userID) {
  if (users[userID] == undefined) {
    return "";
  }
  return !!userID ? users[userID].email : "";
}

function createShortURL(userID, longURL) {
  const shortURL = generateRandomString(tinyURLLength);
  urlDatabase[shortURL] = {
    shortURL : shortURL,
    userID: userID,
    longURL: longURL,
    dateCreated :  new Date(),
    totalHits : 0,
    ownerHits : 0
  };
  return shortURL;
}

// Return all the URLS for that user
function getURLS(userID) {
  let returnURLS = {};
  for (var key in urlDatabase) {
    if (urlDatabase[key].userID == userID) {
      returnURLS[key] = urlDatabase[key];
    }
  }

  return returnURLS;
}

//Just get a URL data structure for one short URL
function getOneURL(shortURL) {
  //TODO add checking if it is incorrect.
  return urlDatabase[shortURL];
}

function getLongURL(userID, shortURL) {
  //TODO Should check against the userid
  // for (var key in urlDatabase) {
  //   if ((urlDatabase[key].userID == userID) && (key == shortURL) {
  //     returnURL = urlDatabase[key].longURL;
  //   }
  // }
  const returnURL =
    urlDatabase[shortURL] === undefined ? "" : urlDatabase[shortURL].longURL;

  return returnURL;
}

function updateShortURL(userID, shortURL, longURL) {
  //TODO add parameter checking
  urlDatabase[shortURL].longURL = longURL;

  return true;
}

function deleteShortURL(userID, shortURL) {
  //TODO add parameter checking
  if (urlDatabase[shortURL].userID == userID) {
    delete urlDatabase[shortURL];
  }
  return true;
}
function updateCounters(userID,shortURL) {
  urlDatabase[shortURL].totalHits++;
  if (!!userID) {
    urlDatabase[shortURL].ownerHits++;
  }
}
module.exports = {
  // User functions
  getEmail: getEmail,
  validUser: validUser,
  addUser: addUser,
  createShortURL: createShortURL, //createShortURL( userID, LongURL )
  getLongURL: getLongURL, //getLongURL(userID, shortURL)
  getURLS: getURLS, //function getURLS(userID)
  updateShortURL: updateShortURL, //  :  updateShortURL( userID, shortURL, longURL )
  deleteShortURL: deleteShortURL, // deleteShortURL(userID, shortURL)
  getOneURL : getOneURL, //Just get one URL data structure getOneURL(shortURL)
  updateCounters: updateCounters // updateCounters(userid,shortURL) 
};
