/*
*   ROUTE: GET /notes
*/

const AWS= require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
const util = require('./util.js');

exports.handler = async (event) =>{
    try{
        
        let query =  event.queryStringParameters;
        let limit = query && query.limit ? parseInt(query.limit) : 5;
        let user_id = util.getUserId(event.headers);
        let params = {
            TableName : tableName,
            KeyConditionExpression: "user_id=:uid",
            ExpressionAttributeValues: {
                ":uid":user_id
            },
            Limit: limit,
            ScanIndexForward: false
        };

        let startTimestamp = query && query.start ? parseInt(query.start): 0; 

        if(startTimestamp > 0){
            params.ExclusiveStartKey = {
                user_id: user_id,
                timestamp: startTimestamp
            }
        }


        let data = await dynamoDB.query(params).promise();

            return {
                statusCode: 200,
                headers: utils.getResponseHeaders(),
                body: JSON.stringify(data)
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