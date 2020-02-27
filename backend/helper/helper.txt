import http from 'http';
var twilio = require('twilio');
var nodemailer = require('nodemailer');

export const sendEmail = async (toEmail,subject,message) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'idesolutions2015@gmail.com',
          pass: 'startup1'
        }
      });
      
      var mailOptions = {
        from: 'idesolutions2015@gmail.com',
        to: toEmail,
        subject: subject,
        html: message
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: '+ toEmail + '===' + info.response);
        }
      });
}

// random string generator
export const randomString = (count) => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < count; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return text;
}

export const customLogger = (message) => {
    console.log(message);
}
 
// send otp through sms
export const sendSms = async (country_code,NUMBER) => {

    console.log('send sms number :'+country_code+NUMBER)
    let mNumber = country_code+NUMBER;
    let OTP = await generateOtp();
    
    var accountSid = 'AC1d936a0f44ed4ebd569270740691fbf1'; // Your Account SID from www.twilio.com/console
    var authToken = 'a47d9865c5c1c3e15b9a007ce2d71c0f';   // Your Auth Token from www.twilio.com/console

    

    var twilio = require('twilio');
    var client = new twilio(accountSid, authToken);
    let msg = 'Your One time password is '+OTP;
    client.messages.create({
        body: msg,
        to: mNumber.toString(),  // Text this number
        from: '+12057083986' // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));

    
    // let API_KEY = "d37cc8c6-18f7-11e7-9462-00163ef91450";

    // let apiUrl = `/API/V1/${API_KEY}/SMS/${NUMBER}/${OTP}`;

    // let options = {
    //     host: '2factor.in',
    //     path: apiUrl
    // };

    // let req = await http.get(options, function(res) {
    //     customLogger('sendSms status code : ' + res.statusCode);
    //     return OTP;
    // });
    return OTP;
}

// generate otp
const generateOtp = () => {
    let otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
}

export const getFileType = (extension) => {
    //
    switch(extension) { // image or video => 1 image 2 video
        case 'jpg':
        case 'png':
        case 'jpeg':
        case 'gif':
            return 2;

        case 'mp3':
            return 3; 

        case 'mp4':
        case 'mov':
        case 'MOV':
            return 4;

        case 'pdf':
        case 'doc':
            return 5;
            
        default:
            return 0;
    }
}

// method to validate image and video file extensions
export const fileValidate = (type, extension) => {
    let allowedExtensions;
    switch(type) { // image or video => 1 image 2 video
        case 1:
            allowedExtensions = ['jpg','png','jpeg','gif'];
            return allowedExtensions.indexOf(extension);  
        case 2:
            allowedExtensions = ['mp4','mov'];
            return allowedExtensions.indexOf(extension);s
        default:
            return false;
    }
} 
