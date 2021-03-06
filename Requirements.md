# Functional Requirements
## User Stories
As an avid twitter poster, 
I want to be able to shorten links 
so that I can fit more non-link text in my tweets.

## As a twitter reader, 
I want to be able to visit sites via shortened links, 
so that I can read interesting content.

## (Stretch) As an avid twitter poster, 
I want to be able to see how many times my subscribers visit my links 
so that I can learn what content they like.

# Display Requirements
- [X] Site Header:
if a user is logged in, the header shows:
- [X] the user's email
- [X]  a logout button which makes a POST request to /logout
if a user is not logged in, the header shows:
- [X]  a link to the login page (/login)
- [X]  a link to the registration page (/register)
# Behaviour Requirements
## GET /

if user is logged in:
- [X]  (Minor) redirect to /urls
if user is not logged in:
- [X]  (Minor) redirect to /login
## GET /urls
if user is logged in:
- [X]  returns HTML with:
- [X]  the site header (see Display Requirements above)
- [X]  a list (or table) of URLs the user has created, each list item containing:
- [X]  a short URL
- [X]  the short URL's matching long URL
- [X]  an edit button which makes a GET request to /urls/:id
- [X]  a delete button which makes a POST request to /urls/:id/delete
- [X] (Stretch) the date the short URL was created
- [X] (Stretch) the number of times the short URL was visited
- [ ] (Stretch) the number of unique visits for the short URL
- [X]  (Minor) a link to "Create a New Short Link" which makes a GET request to /urls/new
if user is not logged in:
- [ ] returns HTML with a relevant error message
## GET /urls/new

if user is logged in:
- [X] returns HTML with:
- [X]  the site header (see Display Requirements above)
- [X]  a form which contains:
- [X]  a text input field for the original (long) URL
- [X]  a submit button which makes a POST request to /urls
if user is not logged in:
- [X]  redirects to the /login page
## GET /urls/:id

if user is logged in and owns the URL for the given ID:
- [X]  returns HTML with:
- [X]  the site header (see Display Requirements above)
- [X]  the short URL (for the given ID)
- [X]  a form which contains:
- [X]  the corresponding long URL
- [X]  an update button which makes a POST request to /urls/:id
- [X] (Stretch) the date the short URL was created
- [X] (Stretch) the number of times the short URL was visited
- [ ] (Stretch) the number of unique visits for the short URL
if a URL for the given ID does not exist:
- [ ] (Minor) returns HTML with a relevant error message
if user is not logged in:
- [ ] returns HTML with a relevant error message
if user is logged it but does not own the URL with the given ID:
- [ ] returns HTML with a relevant error message
## GET /u/:id

if URL for the given ID exists:
- [X]  redirects to the corresponding long URL
if URL for the given ID does not exist:
- [ ] (Minor) returns HTML with a relevant error message
## POST /urls

if user is logged in:
- [X]  generates a short URL, saves it, and associates it with the user
- [X]  redirects to /urls/:id, where :id matches the ID of the newly saved URL
if user is not logged in:
- [ ] (Minor) returns HTML with a relevant error message
## POST /urls/:id

if user is logged in and owns the URL for the given ID:
- [X]  updates the URL
- [X]  redirects to /urls
if user is not logged in:
- [ ] (Minor) returns HTML with a relevant error message
if user is logged it but does not own the URL for the given ID:
- [ ] (Minor) returns HTML with a relevant error message
## POST /urls/:id/delete
if user is logged in and owns the URL for the given ID:
- [X]  deletes the URL
- [X]  redirects to /urls
if user is not logged in:
- [ ] (Minor) returns HTML with a relevant error message
if user is logged it but does not own the URL for the given ID:
- [ ] (Minor) returns HTML with a relevant error message
## GET /login
if user is logged in:
- [X]  (Minor) redirects to /urls
-if user is not logged in:
- [X] returns HTML with:
- [X]  a form which contains:
- [X]  input fields for email and password
- [X]  submit button that makes a POST request to /login
## GET /register
if user is logged in:
- [ ] (Minor) redirects to /urls
if user is not logged in:
- [X]  returns HTML with:
- [X]  a form which contains:
- [X]  input fields for email and password
- [X]  a register button that makes a POST request to /register
##POST /login
 
 if email and password params match an existing user:
- [X]  sets a cookie
- [X]  redirects to /urls
if email and password params don't match an existing user:
- [X]  returns HTML with a relevant error message
## POST /register
 
if email or password are empty:
- [X]  returns HTML with a relevant error message
if email already exists:
- [X]  returns HTML with a relevant error message
- [X]  otherwise:
- [X]  creates a new user
- [X]  encrypts the new user's password with bcrypt
- [X]  sets a cookie
- [X]  redirects to /urls
## POST /logout
 
- [X]  deletes cookie
- [X]  redirects to /urls
