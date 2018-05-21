const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function(req, res) {

    if(!req.body.phone) {
        return res.status(422).send({ error: 'Invalid Phone number'})
    }

    const phone = String(req.body.phone).replace(/[^\d]/g, "");

    admin.auth().getUser(phone)  // asynchronous request 
        .then(userRecord => {
            const code = Math.floor((Math.random() * 8999 + 1000));

            twilio.messages.create({ // asynchronous request but doesnt returns promise so a callback is needed
                body: 'Your code is ' + code,
                to: phone,
                from: '+19203350135'
            }, (err) => {   // callback method --> error function
                if(err) { 
                    return res.status(422).send( err )
                }

                admin.database().ref('users/' + phone)
                    .update({ code: code, codeValid: true }, () => {
                        res.send({ success: true });
                    });
            })
        })  
        .catch(err => { 
            res.status(422).send({ error: err })        
        // .catch() is used because sometimes user is not found and the promise is not resolved instead rejected

        })
}