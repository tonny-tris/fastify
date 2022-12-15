/* 
 * This project is licensed to Kodesayap Inc
 * You can contribute to make this project better by contact me.
 * Please contact me via Phone +6282302021799.
 * Your Regards, Tonny Tris Haripurwanto, A.Md.
 */
const multer = require('fastify-multer') // or import multer from 'fastify-multer'
const upload = multer({ dest: 'uploads/' })

const fastify = require('fastify')({ logger: true })
const test = require('./routes/test')
fastify.register(multer.contentParser)
// fastify.get('/', async(req, reply) => {
//     return { 'message': 'SIPP - Data ' };
// });

fastify.register(require('fastify-cors'), { 
    'origin': '*', //true
    'methods': 'POST' //'GET, POST'
})
fastify.register(test, { prefix: '/api/' })
// fastify.register(require('fastify-cors'), {
//     'origin': '*', //true
//     'methods': 'POST' //'GET, POST'
// })



module.exports = fastify