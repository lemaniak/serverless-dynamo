const getUserId = (headers) => {
    return headers.app_user_id? headers.app_user_id:'test-user-id';
}

const getUserName = (headers) => {
    return headers.app_user_name? headers.app_user_name: 'test-user-name';
}

const getResponseHeaders=()=>{
    return {
        'Access-Control-Allow-Origin': '*'
    }
}

module.exports = {
    getResponseHeaders,
    getUserName,
    getUserId
}