/* 
 * This project is licensed to Kodesayap Inc
 * You can contribute to make this project better by contact me.
 * Please contact me via Phone +6282302021799.
 * Your Regards, Tonny Tris Haripurwanto, A.Md.
 */

const { toJson } = require('../helpers/Result')
const UserService = require('../services/UserService')
var cookieSession = require('cookie-session')
const multer = require('fastify-multer')
const upload = multer({ dest: 'uploads/' })

const actiongetsatker = async(req, reply) => {
    const getsatker = await UserService.getSatker()

    return toJson(reply, 200, "Berhasil mendapatkan data", getsatker)
}

const actionuploadpameran = async(req, reply) => {
    const foto = 'D:/TONNY/apinode/uploads/cobaupload.png'
    const nama = 'a'
    const kabupaten = 'a'
    const provinsi = 'b'
    const instansi = 'b'
    const tujuan = 'a'
    const upload = await UserService.uploadpameran(nama, kabupaten, provinsi, instansi, foto, tujuan)
    // await upload.single('cobaupload')s

    return toJson(reply, 200, "Berhasil insert data", upload)
}

const actionlogindashboard = async(req, reply) => {
    const { username, password } = req.body
    const login = await UserService.logindashboard(username, password)

    return toJson(reply, 200, "Nyambung Kek", login)
}

const actionpassword = async(req, reply) => {
    const { username } = req.body
    const password = await UserService.cariPassword(username)
    
    return toJson(reply, 200, "Data Ditemukan", password)
}

const actioninsertcredentialapps = async(req, reply) => {
    const { user_id, apps_id } = req.body
    const insert = await UserService.cariCredentialsApps(user_id, apps_id)

    return toJson(reply, 200, "Data Ditemukan", insert)
}

const actioninsertdefault = async(req, reply) => {
    const { nip } = req.body
    const insert = await UserService.insertDefault(nip)

    return toJson(reply, 200, "Data Ditemukan", insert)
}

const generateSibuba = async(req, reply) => {
    const { user, username, password } = req.body
    const insert = await UserService.generateSibuba(user, username, password)

    return toJson(reply, 200, "Data Berhasil Ditambah", insert)
}

const generateSinka = async(req, reply) => {
    // const { user, username, password } = req.body
    const insert = await UserService.generateSinka()

    return toJson(reply, 200, "Data Berhasil Ditambah", insert)
}

const generateSikda = async(req, reply) => {
    // const { user, username, password } = req.body
    const insert = await UserService.generateSikda()

    return toJson(reply, 200, "Data Berhasil Ditambah", insert)
}

const actioninsertcredentiallogin = async(req, reply) => {
    const { userapps_id } = req.body
    const insert = await UserService.cariCredentialsLogin(userapps_id)

    return toJson(reply, 200, "Data Ditemukan", insert)
}

const actioninsertcredential = async(req, reply) => {
    const { nip, username, password, jenis } = req.body
    const insert = await UserService.insertCredentials(nip, username, password, jenis)

    return toJson(reply, 200, "Berhasil menambahkan data", insert)
}

const actiongetpuppeterupload = async(req, reply) => {
    const { username, password, nik, tglpesan, urea, npk, npkformula } = req.body
    const getpuppeterupload = await UserService.getPuppeterUpload(username, password, nik, tglpesan, urea, npk, npkformula)
    if(getpuppeterupload != 'Berhasil Insert Data'){
        return toJson(reply, 400, "Gagal Inject", getpuppeterupload)
    }
    return toJson(reply, 200, "Berhasil Inject", getpuppeterupload)
}

const actiongetpuppeter = async(req, reply) => {
    const { username, password } = req.body
    const getpuppeter = await UserService.getPuppeter(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppeter)
}

const actiongetpuppeterKeris = async(req, reply) => {
    const { username, password } = req.body
    const getpuppeterkeris = await UserService.getPuppeterKeris(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppeterkeris)
}

const actiongetpuppetersipijar = async(req, reply) => {
    const { username, password } = req.body
    const getpuppetersipijar = await UserService.getPuppeterSipijar(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppetersipijar)
}

const actiongetpuppetersikda = async(req, reply) => {
    const { username, password } = req.body
    const getpuppetersikda = await UserService.getPuppeterSikda(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppetersikda)
}

const actiongetpuppeteresurat = async(req, reply) => {
    const { username, password } = req.body
    const getpuppeteresurat = await UserService.getPuppeterEsurat(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppeteresurat)
}

const actiongetpuppetersipp = async(req, reply) => {
    const { username, password } = req.body
    const getpuppetersipp = await UserService.getPuppeterSipp(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppetersipp)
}

const actiongetpuppetersiabbagor = async(req, reply) => {
    const { username, password } = req.body
    const getpuppetersiabbagor = await UserService.getPuppeterSiabbagor(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppetersiabbagor)
}

const actiongetpuppeterbondowosokab = async(req, reply) => {
    const { username, password } = req.body
    const getpuppeterbondowosokab = await UserService.getPuppeterBondowosokab(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppeterbondowosokab)
}

const actionupdatepegawaipassword = async(req, reply) => {
    const { nip, password } = req.body
    const update = await UserService.updatePegawaiPassword(nip, password)

    return toJson(reply, 200, "Berhasil update", update)
}

const actiongetpuppeterppid = async(req, reply) => {
    const { username, password } = req.body
    const getpuppeterppid = await UserService.getPuppeterPpid(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppeterppid)
}

const actiongetpuppeterbondowosoku = async(req, reply) => {
    const { username, password } = req.body
    const getpuppeterbondowosoku = await UserService.getPuppeterBondowosoku(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppeterbondowosoku)
}

const actiongetpuppetersibuba = async(req, reply) => {
    const { username, password } = req.body
    const getpuppetersibuba = await UserService.getPuppeterSibuba(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppetersibuba)
}

const actiongetpuppetersaid = async(req, reply) => {
    const { username, password } = req.body
    const getpuppetersaid = await UserService.getPuppeterSaid(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppetersaid)
}

const actiongetpuppetersinka = async(req, reply) => {
    const { username, password } = req.body
    const getpuppetersinka = await UserService.getPuppeterSinka(username, password)

    return toJson(reply, 200, "Berhasil mendapatkan data", getpuppetersinka)
}

const actiongetrekap = async(req, reply) => {
    const { skpd_id } = req.body
    const getrekap = await UserService.getRekap(skpd_id)

    return toJson(reply, 200, "Berhasil mendapatkan data", getrekap)
}

// const actiongetpuppeterbpjs = async(req, reply) => {
//     const { username, password } = req.body
//     const getpuppeterbpjs = await UserService.getPuppeterBPJS(username, password)

//     return toJson(reply, 200, "Berhasil mendapatkan data", getpuppeterbpjs)
// }

module.exports = {
    actiongetsatker,
    actionlogindashboard,
    actionpassword,
    actioninsertcredentialapps,
    actioninsertcredentiallogin,
    actioninsertcredential,
    actiongetpuppeter,
    actiongetpuppeterKeris,
    actiongetpuppetersipijar,
    actiongetpuppetersipp,
    actiongetpuppetersiabbagor,
    actiongetpuppeterbondowosokab,
    actiongetpuppeterppid,
    actiongetpuppeterbondowosoku,
    actiongetpuppetersibuba,
    actiongetpuppetersaid,
    actiongetpuppetersinka,
    actiongetpuppetersikda,
    actiongetpuppeteresurat,
    actiongetrekap,
    actioninsertdefault,
    generateSibuba,
    generateSinka,
    generateSikda,
    actionupdatepegawaipassword,
    actiongetpuppeterupload,
    actionuploadpameran,
    // actiongetpuppeterbpjs
}