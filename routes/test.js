const { default: fastify } = require('fastify')
const TestController = require('../controllers/TestController')
const multer = require('fastify-multer') // or import multer from 'fastify-multer'
const upload = multer({ dest: 'uploads/' })


async function routes(fastify, options) {
    fastify.get('/getsatker', TestController.actiongetsatker)
    fastify.post('/logindashboard', TestController.actionlogindashboard)
    fastify.post('/caripassword', TestController.actionpassword)
    fastify.post('/insertcredential', TestController.actioninsertcredential)
    fastify.post('/caricredentialapps', TestController.actioninsertcredentialapps)
    fastify.post('/caricredentiallogin', TestController.actioninsertcredentiallogin)
    fastify.post('/getrekap', TestController.actiongetrekap)
    fastify.post('/getpuppeter', TestController.actiongetpuppeter)
    fastify.post('/getpuppeterkeris', TestController.actiongetpuppeterKeris)
    fastify.post('/getpuppetersipijar', TestController.actiongetpuppetersipijar)
    fastify.post('/getpuppetersipp', TestController.actiongetpuppetersipp)
    fastify.post('/getpuppetersiabbagor', TestController.actiongetpuppetersiabbagor)
    fastify.post('/getpuppeterbondowosokab', TestController.actiongetpuppeterbondowosokab)
    fastify.post('/getpuppeterppid', TestController.actiongetpuppeterppid)
    fastify.post('/getpuppeterbondowosoku', TestController.actiongetpuppeterbondowosoku)
    fastify.post('/getpuppetersibuba', TestController.actiongetpuppetersibuba)
    fastify.post('/getpuppetersaid', TestController.actiongetpuppetersaid)
    fastify.post('/getpuppetersinka', TestController.actiongetpuppetersinka)
    fastify.post('/insertdefault', TestController.actioninsertdefault)
    fastify.post('/generatesibuba', TestController.generateSibuba)
    fastify.post('/generatesinka', TestController.generateSinka)
    fastify.post('/generatesikda', TestController.generateSikda)
    fastify.post('/getpuppetersikda', TestController.actiongetpuppetersikda)
    fastify.post('/getpuppeteresurat', TestController.actiongetpuppeteresurat)
    fastify.post('/updatepasswordpegawai', TestController.actionupdatepegawaipassword)
    fastify.post('/getpuppeterupload', TestController.actiongetpuppeterupload)
    fastify.post('/uploadpameran', { preHandler: upload.single('cobaupload') }, TestController.actionuploadpameran)
    // fastify.post('/getpuppeterbpjs', TestController.actiongetpuppeterbpjs)
}

module.exports = routes;