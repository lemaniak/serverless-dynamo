'use strict';

const AWS = require('aws-sdk');

AWS.config.apiVersions = {
  dynamodb: '2012-08-10'
};

AWS.config.update({region:'us-west-2'});

const dynamoDB = new AWS.DynamoDB();



module.exports.hello = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};
