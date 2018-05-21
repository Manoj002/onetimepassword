const twilio = require('twilio');

const accountSid = 'AC52d1dd632bedc53552803316bcee5b04';
const authToken = '869d45ad2a58fe8839de7b454625a881';

module.exports = new twilio.Twilio(accountSid, authToken);