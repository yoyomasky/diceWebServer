let request = require("request");
let {success, fail} = require("./myUtils")

async function httpRequest(method, url, params) {
    // console.log("httpRequest:", url, params)
    let promise = new Promise((resolve, reject) => {

        var options = { 
            method: method,
            url: url,
            body: params,
            json: true 
        };
        request(options, function (error, response, body) {

            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });

    let result;
    //第一个参数是成功的回调
    //第二个参数是失败的回调
    await promise.then(function (data) {
        if (data.error) {
            result = fail(data.error)
        } else {
            result = success(data)
        }
    }, function(error) {
        result = fail(error)
    });

    // console.log(JSON.stringify(result))
    return result;
}

module.exports = {

    postRequest: async(url, params) => {
        return await httpRequest("POST", url, params)
    },

    getRequest: async(url, params) => {
        return await httpRequest("GET", url, params)
    },

}