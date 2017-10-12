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
  },
  asdfas: {
    id: "asdfas",
    email: "shawn@shawngriffin.com",
    password: "shawn"
  }
};

// Functions and other worker items remember to refactor these to a module.
//  TODO   check that the key is not a duplicate. or make that part of generateRandomString?
function addUser(newEmail, newPassword) {
  for (const key in users) {
    if (users[key].email == newEmail) { 
      return "";
    }
  }
  let newuserID = generateRandomString(tinyURLLength);

  users[newuserID] = {
    id: newuserID,
    email: newEmail,
    password: newPassword
  };
  
  return newuserID;
}

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

//Get a valid userID from email and password
// (email, password) => userID (string) undefined if not found.

function validUser(email, password) {
  for (let key in users) {
    if (users[key].email === email && users[key].password === password) {
      return users[key].id;
    }
  }
  return "";
}

//Get a email from userID
// (userID) => email (string) undefined if not found.

function getEmail(userID) {
  return users[userID].email;
}

module.exports = {
  // User functions
  getEmail: getEmail,
  validUser: validUser,
  addUser: addUser
};
