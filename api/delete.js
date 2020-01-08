/*
*   ROUTE: DELETE /notes/{noteid}
*/

const AWS= AWSXRay.captureAWS(require('aws-sdk'));

AWS.config.update({region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;
const util = require('./util.js');

exports.handler = async (event) =>{
    try{

        let pnote_id = event.pathParameters.note_id;
        let params = {
            TableName: tableName,
            Key:{
                "user_id": util.getUserId(event.headers),
                "note_id": pnote_id
            }
        };

        console.log(JSON.stringify(params));
        await dynamoDB.delete(params).promise();

            return {
                statusCode: 200,
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