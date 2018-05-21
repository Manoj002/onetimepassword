const admin = require('firebase-admin');

module.exports = function(req, res) {
    if(!req.body.phone || !req.body.code) {
        return res.status(422).send({ error: 'Phone and code must be provided '});
    }

    const phone = String(req.body.phone).replace(/[^\d]/g, "");

    const code = parseInt(req.body.code);

    admin.auth().getUser(phone)
        .then(() => {
            const ref = admin.database().ref('users/' + phone);
            ref.on('value', snapshot => {   //  callback
                ref.off();  // once a connection is taken then turn off the socket for taking connections
                const user = snapshot.val();

                if (user.code !== code || !user.codeValid) { 
                    return res.status(422).send({ error: "Code not valid" })
                }

                ref.update({ codeValid: false })
                admin.auth().createCustomToken(phone)   // returning a JSON WEB TOKEN to user
                    .then(token => res.send({ token : token }))
            }) 
        })
        .catch((err) => {
            res.status(422).send({ error: err })
        })
}