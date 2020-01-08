/*
*   ROUTE: PATCH /note
*/

const AWS= require('aws-sdk');
const moment = require('moment');
AWS.config.update({region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
const util = require('./util.js');

exports.handler = async (event) =>{
    try{
        let item = JSON.parse(event.body).Item;
        item.user_id = util.getUserId(event.headers);
        item.user_name = util.getUserName(event.headers);
        item.expires = moment().add(90,'days').unix();

        let data = await dynamoDB.put({
            TableName: tableName,
            Item: item,
            ConditionExpression: '#t = :t',//updates only if condition expression is true if timestamp already exists
            ExpressionAttributeNames: {
                '#t': 'timestamp',
            },
            ExpressionAttributeValues:{
                ':t': item.timestamp
            }
        }).promise();
            return {
                statusCode: 200,
                headers: utils.getResponseHeaders(),
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