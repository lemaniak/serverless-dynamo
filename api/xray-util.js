var AWSXRay = require('aws-xray-sdk');

const captureAsyncFunc = function  (name, func) {
  return new Promise(function (resolve, reject) {
    AWSXRay.captureAsyncFunc(name, segment => {
      func(segment).then(
        (result) => {
          segment.close()
          resolve(result)
        },
        (error) => {
          segment.close(error)
          reject(error)
        }
      )
    })
  })
}

module.exports = {
  captureAsyncFunc
}