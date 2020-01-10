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
    try{
        console.log("EVENT",JSON.stringify(event));
            let item = JSON.parse(event.body).Item;
            item.user_id = util.getUserId(event.headers);
            item.user_name = util.getUserName(event.headers);
            item.note_id = item.user_id+':'+uuidv4();
            item.timestamp = moment().unix();
            item.expires = moment().add(90,'days').unix();

            let data = await dynamoDB.put({
                TableName: tableName,
                Item: item
            }).promise();

            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(item)
            }
    }catch(err){
        console.log("Error",err);
        return {
            status: err.statusCode? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name? err.name: "Exception",
                message: err.message? err.message: "Unknown Error"
            })
        };
    }

}