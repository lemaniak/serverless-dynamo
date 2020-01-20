/*
*   ROUTE: POST /note
*/
var AWSXRay = require('aws-xray-sdk');
const AWS=  AWSXRay.captureAWS(require('aws-sdk')); /*THIS WILL INSTRUMENT AWS SDK CLIENT SO ANY INVOCATION TO AWS SERVICE WILL BE AUTOMATICALLY LOGGED*/
AWS.config.update({region: 'us-east-1'});
AWSXRay.captureHTTPsGlobal(require('http'));

var http = require('http');/*THIS WILL INSTRUMENT ALL HTTP CALLS */

//var pg = AWSXRay.capturePostgres(require('pg')); /*THIS WILL INSTRUMENT POSTGRES CALLS*/
//var client = new pg.Client();

//var mysql = AWSXRay.captureMySQL(require('mysql'));/*THIS WILL INSTRUMENT MYSQL CALLS*/
//var connection = mysql.createConnection(config);


const util = require('./util.js');
const xray_util = require('./xray-util.js');

exports.handler = async (event) =>{   
    try {
      console.log("EVENT",JSON.stringify(event));      

      /*example of how to invoke an async function  using xray util to log the function times*/
      var data = await xray_util.captureAsyncFunc('DESIRED XRAY-SUBSEGMENT NAME HERE',(segment) => util.fetchData(segment))
      data.segment = AWSXRay.getSegment()
      return data;

    } catch(err) {
      //FOLLOWING LINE WILL ADD AN ERROR TO CURRENT SEGMENT
      console.log(err)
    } 

}


