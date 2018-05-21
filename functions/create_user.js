const admin = require('firebase-admin');

module.exports = function(req, res) {

    // 1. Verify user provided a phone

    if(!req.body.phone) {   // req.body has all user info provided in request
        return res.status(422).send({error : 'Bad Input' });
    }

    // 2. Format phone number to remove dashes and parens

    const phone = String(req.body.phone).replace(/[^\d]/g,"") 
    // req.body.phone is coming in request object and user can send string or number or any type data
    // So we are using String() constructor to convert req.body.phone to string and 
    // using replace regex expression to replace any dashes parens or white spaces in empty string.

    // 3. Create a new user account using that phone number

    admin.auth().createUser({ uid: phone })
        .then(user => res.send(user))
        .catch(err => res.status(422).send({ error: err }));
    // uid --> unique id of user
    // admin --> we access serviceAccount
    // auth() --> we access serviceModule
    // createUser() --> create a user with a phone number as unique id
    // creates a asynchronous request ang gets a promise in return so we can use .then() and .catch()

    // 4. Respond to user request saying account was made
}