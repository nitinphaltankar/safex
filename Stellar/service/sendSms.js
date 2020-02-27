// const accountSid = 'AC6beda5a6add9e30ae1deb2004bfeb1ac';
// const authToken = '8c960e4dfc245e911d832cc76e3f1627';
const accountSid = 'AC1d936a0f44ed4ebd569270740691fbf1'; // Your Account SID from www.twilio.com/console
const authToken = 'a47d9865c5c1c3e15b9a007ce2d71c0f';   // Your Auth Token from www.twilio.com/console
const client = require('twilio')(accountSid, authToken);

export const sendSms = async (mobileNumber) => {
  console.log('called');
  const otp = Math.floor(1000 + Math.random() * 9000);
  await client.messages
    .create({
      body: otp,
      from: '+12057083986',
      to: mobileNumber
    })
    .then(message => console.log('message', message.sid))
    .done();
  return otp;
}