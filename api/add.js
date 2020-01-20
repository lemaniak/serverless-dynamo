/*
*   ROUTE: POST /note
*/
var AWSXRay = require('aws-xray-sdk');
const AWS=  AWSXRay.captureAWS(require('aws-sdk'));
const moment=require('moment');
const uuidv4=require('uuid/v4');
AWS.config.update({region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
const util = require('./util.js');

exports.handler = async (event) =>{
    console.log("EVENT", JSON.stringify(event));

    try {
       
        let item = event.payload;
        item.note_id = uuidv4();
        item.user_id = 'user'+uuidv4();
        item.timestamp = moment().unix();
        item.expires = moment().add(90,'days').unix();
    
        let data = await dynamoDB.put({
            TableName: tableName,
            Item: item
        }).promise();
    
        return {
            statusCode: 200,
            headers: {},
            body: JSON.stringify(data)
        }
      } catch(err) {
        AWSXRay.getSegment().addError(err)
        console.log("Error",err);
        throw err
      } finally {
        AWSXRay.getSegment().close()
      }

}


