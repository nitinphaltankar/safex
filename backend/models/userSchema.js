import mongoose from 'mongoose';
import aes256 from 'aes256';

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId; 
 
const UserModel = new Schema({
    country_code: String,
    mobile_number: String,
    mobile_with_country_code : String,
    full_name: String,
    device_type: { type: String,enum: ['ANDROID','IOS'] },
    device_token: String,
    profile_picture: String,
    otp: Number,
    authorization: String,
    stellarAddress: String,
    stellarSeed: String,
    status: String,
    proofs: { type: ObjectId, ref: 'proof' },
    mobile_verified: { type: Number, default: 0},
    created_at: { type: Date, default: Date.now }
});


export const User = mongoose.model('user', UserModel);