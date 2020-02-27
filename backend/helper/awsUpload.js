import multiparty from 'multiparty';

import { awsS3 } from '../config/env';
import { throwError } from './errorHandler';
import { fileValidate, randomString, getFileType } from '../helper/helper';
import fs from 'fs';

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: awsS3.ACCESS_KEY_ID,
  secretAccessKey: awsS3.SECRET_KEY_ACCESS
});
 
export const s3Upload = (req,res) => { 
    return new Promise(async (resolve, reject) => {

        let imageName;
        imageName = await randomString(32);

        let form = new multiparty.Form(); 
        await form.parse(req, async (error, fields, files) => {
            if(error) throwError(res,429,error.message);
            console.log(files);
            console.log(files.media); 
            const extensionArray = files.media[0].path.split('.');
            const extension = extensionArray[extensionArray.length - 1];
            let fileType = await getFileType(extension);
            // image type extension validation
            // let validate = fileValidate(1, extension);
            // if(validate < 0) throwError(res, 500, "only images are allowed");

            // save it local
            fs.readFile(files.media[0].path, (err, data) => {

                //var contentType = files.media[0].headers.content-type;
                if (err) throw err;

                // upload to s3
                const params = {
                    Bucket: awsS3.BUCKET_NAME,
                    Key: `${imageName}.${extension}`,
                    Body: data, 
                    ACL: 'public-read'
                };

                s3.upload(params, function(s3Err, data) {
                    if (s3Err != undefined) throwError(res, 429, s3Err); // throw s3Err
                    //console.log(`File uploaded successfully at ${data.Location}`);
                    console.log(`File uploaded successfully`);
                    console.log("s3Err : " + JSON.stringify(s3Err));
                    console.log("data : " + JSON.stringify(data));
                    resolve({url: data.Location,type: fileType}); 
                });
            });
        });
    })
}