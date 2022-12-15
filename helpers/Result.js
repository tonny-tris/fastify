/* 
 * This project is licensed to Kodesayap Inc
 * You can contribute to make this project better by contact me.
 * Please contact me via Phone +6282302021799.
 * Your Regards, Tonny Tris Haripurwanto, A.Md.
 */

const toJson = (reply, code, message, data = []) => {
    var metadata = {}

    metadata['code'] = code
    metadata['status'] = generateStatus(code)
    metadata['message'] = message

    var response = {}
    response['data'] = data

    var kdsResponse = {
        metadata,
        response
    }

    var kdsresponse = reply
        .code(code)
        .headers('Content-Type', 'multipart/form-data') 
        // .header('Access-Control-Allow-Origin', 'http://103.161.108.40')
        // .header('Access-Control-Allow-Origin', 'https://integrator.bondowosokab.go.id')
        // .header('Access-Control-Allow-Origin', '*')
        // .header('Access-Control-Allow-Origin', 'http://integrator.bondowosokab.go.id')//
        // .header("Access-Control-Allow-Origin","*")
        // .header("Access-Control-Allow-Methods","PUT,GET,DELETE,PATCH")
        // .header('Access-Control-Allow-Credentials', true)
        // .header('Access-Control-Allow-Headers','X-Requested-With,content-type,Origin,Accept,Authorization')
        .send(kdsResponse)

    return kdsresponse
}

const generateStatus = (code) => {
    switch (code) {
        case 200:
            var status = "OK"
            break
        case 201:
            var status = "ERR_REQUIRED"
            break
        case 404:
            var status = "ERR_NOT_FOUND"
            break
        case 500:
            var status = "ERR_INTERNAL"
            break
        default:
            var status = "UNKNOWN"
            break
    }

    return status
}

module.exports = { toJson }