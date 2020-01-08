/*
*   ROUTE: GET /note/n/
*/

var AWSXRay = require('aws-xray-sdk');
const AWS= AWSXRay.captureAWS(require('aws-sdk'));
const _=require('underscore');
AWS.config.update({region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
const util = require('./util.js');

exports.handler = async (event) =>{
    try{

        let node_id= decodeURIComponent(event.pathParameters.note_id);
        let params = {
            TableName: tableName,
            IndexName: "note_id-index",
            KeyConditionExpression: "note_id = :note_id",
            ExpressionAttributeValues: {
                ":note_id": note_id
            },
            Limit: 1
        };

        let data = await dynamoDB.query(params).promise();

        if(!_.isEmpty(data.items)){
            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(data.Items[0])
            }
        }

            return {
                statusCode: 404,
                headers: util.getResponseHeaders()
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