import { User } from '../models/userSchema';
import { randomString, sendSms, sendEmail } from '../helper/helper';
import { throwError } from '../helper/errorHandler';
import { s3Upload } from '../helper/awsUpload';
import async from 'async';
const axios = require('axios')

//import { createAccount } from '../../../backend/src/service/stellarAccount';

// create a new user
export const createUser = async (req, res) => {
   console.log('params '+JSON.stringify(req.body));
	const user = new User(req.body);
    // TODO implement otp
//	console.log('inside createuser '+JSON.stringify(req));
	let oldUser = await findUser(req.body.mobile_number);
    if(oldUser != null){
       console.log('User Found Returning : '+JSON.stringify(oldUser));
        return res.status(200).send({status: true,type:0,result: oldUser});
    }else{

        let otp = await sendSms(req.body.country_code,req.body.mobile_number);

        //let URL = 'https://safexchat-stellar.herokuapp.com/account';
        let URL = 'http://localhost:4000/account';
    axios.post(URL)
    .then((body) => {
        // console.log('====> '+body.data.toString())
        // console.log('====> '+JSON.stringify(body.data))
        // console.log('====> '+body.data.stellarAddress)
        user.stellarAddress = body.data.data.stellarAddress;
          user.stellarSeed = body.data.data.stellarSeed; 
                
            user.otp = otp;
            user.authorization = randomString(32);
            user.save(async (error, response) => {
                if(error) throwError(res, 500, error);
                console.log('User Saved Returning');
                return res.status(200).send({status: true,type:1, result: response});
            });
    })
    .catch((error) => {
        console.error(error)
    });

    
    }
}

// update user profile
export const updateProfile = (req, res) => {
    User.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true})
        .exec((error, response) => {
            if(error) throwError(res, 500, error);
            res.status(200).send({status: true, result: response});
        }); 
}


// upload image
export const profileUpload = async (req, res) => {
    let location = await s3Upload(req, res);
    res.status(200).send({status: true, result: location});
}

// resent otp
export const resendOtp = async (req,res) => {

    let otp = await sendSms(req.body.mobile_number);
        
    User.findOneAndUpdate({_id: req.body.user}, {$set: otp}, {new: true}, (error, response) => {
        if(error) throwError(res, 500, error);
        res.status(200).send({status: true, result: response});
    });    
}


// verify otp
export const verifyOtp = (req,res) => {

    User.findOne({ $and: [{_id: req.body.user}, {otp: req.body.otp}]}).exec((error, response) => {
        if(error) return res.status(500).send(error);
        if(response){
            User.findOneAndUpdate({_id: req.body.user}, {$set: {mobile_verified: 1}}, {new: true}, (error, resp) => {
                if(error) throwError(res, 500, error);
                return res.status(200).send({"status":true,"success_message":"OTP verified successfully", 'result': response});
            });    
        }else{
            return throwError(res, 401, "Invalid OTP");
        }
    });
}

// get users list
export const getUsers = (req, res) => {
    Users.find()
        .exec((error, response) => {
            if(error) return res.status(500).send(error);
            res.status(200).send({status: true, result: response});
        });
}

// find users in whatsapp network
export const contact = (req, res) => {
    console.log('contact api hitted '+req.body);
    let networkList = []; 
    if(req.body.device_type != 'ANDROID'){ 
//    	req.body.contact = JSON.parse(req.body.contact);
    } 

    async.eachLimit(req.body.contact, 1, async(contact, callback) => {
        contact.mobile_number.replace(/^(\+)(\d*)(.*)/, '$1852$3');
        let user = await findUser(contact.mobile_number);
        if(user == null){
            let mNumber = contact.mobile_number;
            user = await findUserWithCode(mNumber);
        }
        if(user != null) networkList.push(Object.assign({}, contact, {profile_picture: user.profile_picture, status: user.status, id: user._id}));
        else console.log('Not in network');
        //callback();
    }, (error) => {
        if(error) {
            console.log("Error : " + error);
            return throwError(res, 500, error);
        }
        res.status(200).send({status: true, result: networkList});
    });
}

const findUser = async (mobile_number) => {
    console.log('findUser==>'+mobile_number);
    return new Promise((resolve, reject) => {
        User.findOne({mobile_number: mobile_number}).exec((error,response) => {
            if(error) return throwError(res, 500, error);
            resolve(response);
        });
    })
}

const findUserWithCode = async (mobile_number) => {
    console.log('findUserWithCode==>'+mobile_number);
    return new Promise((resolve, reject) => {
        User.findOne({mobile_with_country_code: mobile_number}).exec((error,response) => {
            if(error) return throwError(res, 500, error);
            resolve(response);
        });
    })
}



