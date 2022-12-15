/* 
 * This project is licensed to Kodesayap Inc
 * You can contribute to make this project better by contact me.
 * Please contact me via Phone +6282302021799.
 * Your Regards, Tonny Tris Haripurwanto, A.Md.
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const data = require('../controllers/TestController')
const puppeteer = require('puppeteer');
const phone = puppeteer.devices['iPhone X'];

const getSatker = async() => {
    // const satker = await prisma.data_satker.findMany({
    //     select: {
    //         id: true,
    //         code: true,
    //         satuan_kerja: true,
    //         skpd_id: true,
    //         status: true
    //     }
    // })

    // return satker
    const skpd = await prisma.data_skpd.findMany({
        select: {
            code: true,
            skpd: true
        }
    })
    return skpd
}

const logindashboard = async(username, password) => {
    console.log(password);
    const loginpassword = await prisma.data_pegawai.findMany({
        where: {
            nip: username
        },
        select: {
            id: true,
            password_encoded: true,
            wanumber: true
        }
    })

    const cariRole = await prisma.user_apps.findMany({
        where: {
            user_id: username
        },
        select: {
            id: true,
            user_id: true,
            apps_id: true
        }
    })

    var cariSingkatan = []
    for(var i = 0; i < cariRole.length; i++){
        const namapanjang = await prisma.data_apps.findMany({
            where: {
                apps: cariRole[i].apps_id
            },
            select: {
                nama: true
            }
        })
        cariSingkatan.push(namapanjang[0])
    }
    console.log(cariSingkatan)

    var random = Math.floor(Math.pow(10, 4-1) + Math.random() * 9 * Math.pow(10, 4-1))
    var a = []
    for(var j = 0; j < cariRole.length; j++){
        a.push({"id" : cariRole[j].id, "user_id" : cariRole[j].user_id, "apps_id" : cariRole[j].apps_id, "singkatan" : cariSingkatan[j].nama})
    }


    if(password == loginpassword[0].id){
        return {'status' : 'Autentikasi Berhasil', 'wanumber':loginpassword[0].wanumber, "token":random, 'data' :a}
    }else 
    if(password == loginpassword[0].password_encoded){
        return {'status' : 'Autentikasi Berhasil', 'wanumber':loginpassword[0].wanumber, "token":random, 'data':a}
    }else{
        return {'status' : 'Autentikasi Gagal', 'data': a}
    }

}

const cariPassword = async(username) => {

    const password = await prisma.data_pegawai.findMany({
        where: {
            nip: username
        },
        select: {
            password_encoded: true,
            id: true,
            password: true
        }
    })
    console.log(password[0].password)
    return password
}

const cariCredentialsApps = async(user_id, apps_id) => {

    const cariid = await prisma.user_apps.findMany({
        where: {
            AND: {
                user_id: user_id,
                apps_id: apps_id
            }
        },
        select: {
            id: true
        }
    })

    return cariid

}

const cariCredentialsLogin = async(userapps_id) => {

    const cariid = await prisma.user_apps_credentials.findMany({
        where: {
            userapps_id: userapps_id
        },
        select: {
            id: true,
            userapps_id: true,
            username: true,
            password: true
        }
    })

    return cariid

}

const uploadpameran = async(nama, kabupaten, provinsi, instansi, foto, tujuan) => {
    
    const upload = await prisma.buku_tamu_pameran.create({
        data: {
            nama_pengunjung: nama,
            kabupaten_pengunjung: kabupaten,
            provinsi_pengunjung: provinsi,
            instansi_pengunjung: instansi,
            foto_pengunjung: foto,
            tujuan_pengunjung: tujuan
        }
    })

    return upload
}
    
const insertCredentials = async(nip, username, password, jenis) => {

    const cariid = await prisma.user_apps.findMany({
        where: {
            user_id: nip,
            apps_id: jenis
        },
        select: {
            id: true
        }
    })
    console.log("hasil : " +cariid)

    const cari = await prisma.user_apps_credentials.findMany({
        where: {
            userapps_id: cariid[0].id
        },
        select: {
            userapps_id: true
        }
    })

    if (cari.length == 0) {
        const insert = await prisma.user_apps_credentials.create({
            data: {
                // userapps_id: userapp,
                username: username,
                password: password,
                srctoken: '-',
                validtoken: '-',
                user_apps: {
                    connect: {
                        id: cariid[0].id
                    }
                }
            }
        })

        return insert
    } else {
        console.log(cari[0].userapps_id)
        // const update = await prisma.$queryRaw`
        // -- UPDATE user_apps_credentials set(username, password) = ()
        // -- SELECT * FROM data_pegawai 
        // -- WHERE nama_asn LIKE ${`%${datapegawai[i].username}%`}
        // -- AND jabatan_description LIKE '%bidan%'
        // -- LIMIT 1
        // -- ;`
        const update = await prisma.user_apps_credentials.updateMany({
            where: {
                userapps_id: cari[0].userapps_id
            },
            data: {
                // userapps_id: userapp,
                username: username,
                password: password,
                // srctoken: '-',
                // validtoken: '-',
                // user_apps: {
                //     connect: {
                //         id: cari[0].id
                //     }
                // }
            }
        })

        return update
    }

}

const updatePegawaiPassword = async(nip, password) => {
    const update = await prisma.data_pegawai.updateMany({
            where: {
                nip: nip
            },
            data: {
                password_encoded: password,
            }
        })

        return update
}

const bcrypt = require("bcrypt");
const insertDefault = async(nip) => {

    const caripegawai = await prisma.user.findMany({
        where: {
            username: nip
        },
        select: {
            id: true
        }
    })

    var passwordhash, fullname, photo, pegawaiid
    const salt = await bcrypt.genSalt(13);
    if(caripegawai.length == 0){
        const caridatapegawai = await prisma.data_pegawai.findMany({
            where: {
                nip: nip
            },
            select: {
                id: true,
                password_encoded: true,
                nama_asn: true,
                photo: true
            }
        })
        fullname = caridatapegawai[0].nama_asn
        photo = caridatapegawai[0].photo
        pegawaiid = caridatapegawai[0].id.toString()
        var passwordhas = await bcrypt.hash(caridatapegawai[0].password_encoded, salt);
        passwordhash = passwordhas.replace("$2b$","$2y$")
        await prisma.user.create({
            data: {
                username: nip,
                password_hash: passwordhash,
                fullname: fullname,
                auth_key: "-",
                password_reset_token: "-",
                status: "10",
                email: "-",
                role_id: "USER",
                photo: photo,
                pegawai_id: pegawaiid
            }
        })
    }

    var aplikasi = ['simpeg','sipijar','keris','sinobo', 'siabbagor', 'sipp']
    aplikasi.sort()
    var insert = []
    for(var i=0;i<aplikasi.length;i++){
            const temu = await prisma.user_apps.findMany({
                where: {
                    AND: {
                        apps_id: aplikasi[i],
                        user_id: nip
                    }
                },
                select: {
                    id: true,
                    apps_id: true,
                }
            })
            if(temu.length == 0){
                insert.push(
                    await prisma.user_apps.create({
                        data:{
                            user_id: nip,
                            apps_id: aplikasi[i]
                        }
                    })
                )
            }
    }
    return insert
}


const getPuppeterUpload = async(username, password, nik, tglpesan, urea, npk, npkformula) => {
    var url
    const delay = time => new Promise(res=>setTimeout(res,time));
    const browser = await puppeteer.launch({ headless: false
        , args:[
       '--start-maximized'
    ] 
});
    const page = await browser.newPage();
    try {
        await login()
        async function login() {
            await page.setViewport({ width: 1366, height: 768});
            const navigationPromise = page.waitForNavigation({ waitUntil: 'load', timeout: 0 });
            await page.goto('https://erdkk.pertanian.go.id/verval/tpubersv2022');
            await navigationPromise;
            await page.waitForSelector('input[type="text"]')
            await page.type('input[type="text"]', username);
            await page.waitForSelector('input[type="password"]')
            await page.type('input[type="password"]', password);
            await page.waitForSelector('[class="btn btn-primary btn-block"]')
            await page.click('[class="btn btn-primary btn-block"]')
            await cari()
        }
        async function cari() {
            url = page.url()
            // if(url != 'https://erdkk.pertanian.go.id/verval/tpubersv2022/dashboard'){
            //     return login()
            // }
            if(url == 'https://erdkk.pertanian.go.id/verval/tpubersv2022/index.php'){
                return login()
            }
            await delay(2000)
            await Promise.all([
                page.goto('https://erdkk.pertanian.go.id/verval/tpubersv2022/cari_nik'),
            ])
            await Promise.all([
                delay(2000),
                page.evaluate(() => {
                    document.querySelector(`select[name="kode_kec"]`).selectedIndex = 1;
                }),
            ])
            await Promise.all([
                delay(1000),
                page.waitForSelector('input[type="number"]'),
                page.type('input[type="number"]', nik),
            ])
                await delay(1000)
                await page.waitForSelector('button[type="submit"]')
                await page.click('button[type=submit]')
                await insert()
        }
        async function insert() {
            url = page.url()
            if(url == 'https://erdkk.pertanian.go.id/verval/tpubersv2022/dashboard.php'){
                return cari()
            }
            if(url == 'https://erdkk.pertanian.go.id/verval/tpubersv2022/index.php'){
                return login()
            }
            if(url == 'https://erdkk.pertanian.go.id/verval/tpubersv2022/'){
                return login()
            }
            await delay(3000)
            await Promise.all([
            page.waitForSelector('input[id="tgl_tebus"]'),
            page.$eval('input[id="tgl_tebus"]',(e) => e.removeAttribute("readonly")),
            page.type('input[id="tgl_tebus"]', tglpesan)
            ])
            await Promise.all([
                page.waitForSelector('input[id="urea_mod"]'),
                page.evaluate( () => document.getElementById("urea_mod").value = ""),
                page.type('input[id="urea_mod"]', urea)
            ])
            await Promise.all([
                delay(1000),
                page.waitForSelector('input[id="npk_mod"]'),
                page.evaluate( () => document.getElementById("npk_mod").value = ""),
                page.type('input[id="npk_mod"]', npk),
            ])
            await Promise.all([
                delay(1000),
                page.waitForSelector('input[id="npk_formula_mod"]'),
                page.evaluate( () => document.getElementById("npk_formula_mod").value = ""),
                page.type('input[id="npk_formula_mod"]', npkformula),
            ])
            await Promise.all([
                page.screenshot({path: 'hasil.png'})
            ])
            
        }
        // await browser.close()
        return 'Berhasil Insert Data'
        // await page.waitForSelector('input[type=file]');
        // const inputUploadHandle = await page.$('input[type=file]');
        // let file = 'D:/LATSAR/Aktualisasi/laporan akhir/foto/Blank diagram.png';
        // inputUploadHandle.uploadFile(file);
        // // Promise.all([
        // // await page.click('input[type=submit]'),
        // // ])
        //
    } catch (e) {
        console.log(e)
        return 'Gagal Insert Data'
    }
}

const getPuppeter = async(username, password) => {
    var a = {}
    var key = 'halaman_simpeg'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const delay = time => new Promise(res=>setTimeout(res,time));
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('http://simpeg.bondowosokab.go.id/auth/login');
        // await page.goto('https://nl.hideproxy.me/index.php')
        await navigationPromise;
        // await page.waitForSelector('input[type="text"]')
        // await page.type('input[type="text"]', 'simpeg.bondowosokab.go.id');
        // await page.waitForSelector('button[class="hidemeproxy__button hidemeproxy__button--secondary"]')
        // await page.type('button[class="hidemeproxy__button hidemeproxy__button--secondary"]');
        // page.waitForNavigation({ timeout: 0 }),
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', username);
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
        await page.waitForSelector('button[type="submit"]'),
            // await page.click('button[type=submit]'),
            console.log('berhasil')
        Promise.all([
            // page.click('#submit_button'),
            await page.click('button[type=submit]'),
            await delay(3000),
            page.waitForNavigation({ timeout: 0 }),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
    } catch (e) {
        console.log(e)
    }
    // return a
}

const getPuppeterEsurat = async(username, password) => {
    var a = {}
    var key = 'halaman_esurat'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const delay = time => new Promise(res=>setTimeout(res,time));
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('https://esurat.bondowosokab.go.id');
        // await page.goto('https://nl.hideproxy.me/index.php')
        await navigationPromise;
        // await page.waitForSelector('input[type="text"]')
        // await page.type('input[type="text"]', 'simpeg.bondowosokab.go.id');
        // await page.waitForSelector('button[class="hidemeproxy__button hidemeproxy__button--secondary"]')
        // await page.type('button[class="hidemeproxy__button hidemeproxy__button--secondary"]');
        // page.waitForNavigation({ timeout: 0 }),
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', username);
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
        await page.waitForSelector('button[type="submit"]'),
            // await page.click('button[type=submit]'),
            console.log('berhasil')
        Promise.all([
            // page.click('#submit_button'),
            await page.click('button[type=submit]'),
            await delay(3000),
            page.waitForNavigation({ timeout: 0 }),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
    } catch (e) {
        console.log(e)
    }
    // return a
}

const getPuppeterKeris = async(username, password) => {
    var a = {}
    var key = 'halaman_keris'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const delay = time => new Promise(res=>setTimeout(res,time));
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('http://keris.bondowosokab.go.id/auth/login');
        await navigationPromise;
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', username);
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
        await page.waitForSelector('button[type="submit"]'),
            // await page.click('button[type=submit]'),
            console.log('berhasil')
        Promise.all([
            // page.click('#submit_button'),
            await page.click('button[type=submit]'),
            await delay(3000),
            page.waitForNavigation({ timeout: 0 }),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
    } catch (e) {
        console.log(e)
    }
    // return a
}

const getPuppeterSipijar = async(username, password) => {
    var a = {}
    var key = 'halaman_sipijar'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const delay = time => new Promise(res=>setTimeout(res,time));
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('http://sipijar.bondowosokab.go.id/sipijar_v2/login');
        await navigationPromise;
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', username);
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
        await page.waitForSelector('button[type="submit"]'),
            // await page.click('button[type=submit]'),
            console.log('berhasil')
        Promise.all([
            // page.click('#submit_button'),
            await page.click('button[type=submit]'),
            await delay(3000),
            page.waitForNavigation({ timeout: 0 }),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
    } catch (e) {
        console.log(e)
    }
    // return a
}

const getPuppeterSipp = async(username, password) => {
    var a = {}
    var key = 'halaman_sipp'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const delay = time => new Promise(res=>setTimeout(res,time));
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('https://satudata.bondowosokab.go.id/');
        await navigationPromise;
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', username);
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
        await page.waitForSelector('input[type="submit"]'),
            // await page.click('input[type=submit]'),
            console.log('berhasil')
        Promise.all([
            // page.click('#submit_button'),
            await page.click('input[type=submit]'),
            await delay(5000),
            page.waitForNavigation({ timeout: 0 }),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
        // await delay(3000);
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
        //     await delay(2000);
    } catch (e) {
        console.log(e)
    }
    // return a
}

const getPuppeterSiabbagor = async(username, password) => {
    var a = {}
    var key = 'halaman_siabbagor'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const delay = time => new Promise(res=>setTimeout(res,time));
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('https://siabbagor.bondowosokab.go.id/');
        await navigationPromise;
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', username);
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
        await page.waitForSelector('button[type="submit"]'),
            // await page.click('button[type=submit]'),
            console.log('berhasil')
        Promise.all([
            // page.click('#submit_button'),
            await page.click('button[type=submit]'),
            await delay(3000),
            page.waitForNavigation({ timeout: 0 }),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
    } catch (e) {
        console.log(e)
    }
    // return a
}

const getPuppeterSikda = async(username, password) => {
    var a = {}
    var key = 'halaman_sikda'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    var buttonClick
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const delay = time => new Promise(res=>setTimeout(res,time));
    try {
        // await page.setViewport({ width: 1366, height: 1000});
        // const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        // // await Promise.all([
        // //     // await page.click( '#app > div > section > div > div:nth-child(1) > div > form > div:nth-child(3) > button' )
        // // ]);
        // await page.goto('http://sikda.bondowosokab.go.id/login'),
        //     await navigationPromise
        // const emailInput = 'input[name="uname"]'
        // const emailWords = username
        // await page.waitForSelector( emailInput, { timeout: 0 })
        // await page.focus(emailInput)
        // await page.keyboard.type(emailWords).then(async()=>{
        //     await delay(3000)
        //     const passwordInput = 'input[name="pass"]'
        //     const passwordWords = password
        //     await page.waitForSelector( passwordInput, { timeout: 0 })
        //     await page.focus(passwordInput)
        //     await page.keyboard.type(passwordWords)
        //     const emailInput = 'input[name="uname"]'
        //     const emailWords = username
        //     await page.waitForSelector( emailInput, { timeout: 0 })
        //     await page.focus(emailInput)
        //     await page.keyboard.type(emailWords)
        // })
        //benar
        await page.setViewport({ width: 1366, height: 1000});
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        // await Promise.all([
        //     // await page.click( '#app > div > section > div > div:nth-child(1) > div > form > div:nth-child(3) > button' )
        // ]);
        await page.goto('http://sikda.bondowosokab.go.id/login'),
            await navigationPromise
        const emailInput = 'input[name="uname"]'
        const emailWords = username
        await page.waitForSelector( emailInput, { timeout: 0 })
        await page.focus(emailInput)
        await page.keyboard.type(emailWords)
        // .then(async()=>{
            await delay(3000)
            const passwordInput = 'input[name="pass"]'
            const passwordWords = password
            await page.waitForSelector( passwordInput, { timeout: 0 })
            await page.focus(passwordInput)
            await page.keyboard.type(passwordWords)
            await page.waitForSelector('[class="btn btn-primary btn-login fadeIn animated delay-5"]')
            await page.click('[class="btn btn-primary btn-login fadeIn animated delay-5"]')
            // .then(async()=>{
                Promise.all([
                    // page.click('#submit_button'),
                    // await page.click('button[type=submit]'),
                    await delay(2000),
                    page.waitForNavigation({ timeout: 0 }),
                    cookiesObject = await page.cookies(),
                    console.log('Halaman URL:', page.url()),
                    halaman = page.url(),
                    halaman2 = { halaman },
                    a[key].push(halaman2),
                    a[key].push({ session: cookiesObject }),
                    JSON.stringify(a),
                ])
                return a
            // })
            // const emailInput = 'input[name="uname"]'
            // const emailWords = username
            // await page.waitForSelector( emailInput, { timeout: 0 })
            // await page.focus(emailInput)
            // await page.keyboard.type(emailWords)
        // })
        ////////////
            // await page.waitForSelector('input[type="text"]'),
            // await page.type('input[type="text"]', username),
            // await page.waitForSelector('input[type="password"]'),
            // await page.type('input[type="password"]', password),
            // await delay(7000)
            // await page.waitForSelector('#app > div > section > div > div:nth-child(1) > div > form > div:nth-child(3) > button'),
            // // buttonClick = await page.$('#app > div > section > div > div:nth-child(1) > div > form > div:nth-child(3) > button'),
            // await page.click('#app > div > section > div > div:nth-child(1) > div > form > div:nth-child(3) > button')
        // await page.waitForSelector('button[type="button"]'),
        //     await page.click('button[type=button]'),
        // Promise.all([
        //     // page.click('#submit_button'),
        //     // await page.click('button[type=submit]'),
        //     await delay(2000),
        //     page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a),
        // ])
        // return a
        //     console.log('berhasil')
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
    } catch (e) {
        console.log(e)
    }
    // return a
}

// const puppeteerekstra = require('puppeteer-extra');
// const pluginStealth = require('puppeteer-extra-plugin-stealth')
// const solve = require('../helpers/index')
// const delay = time => new Promise(res=>setTimeout(res,time));
// const getPuppeterBondowosokab = async(username, password) => {
//     puppeteerekstra.use(pluginStealth())
//     var a = {}
//     var key = 'halaman_bondowosokab'
//     a[key] = []
//     var halaman
//     var halaman2
//     var cookiesObject
//     const browser = await puppeteerekstra.launch({ headless: false, args: ['--window-size=360,800', '--window-position=000,000', '--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials'] });
//     const page = await browser.newPage();
//     await page.setDefaultNavigationTimeout(30000)
//     const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
//         page.goto('https://bondowosokab.go.id/admin/login');
//         navigationPromise;
//     try {
//         await page.waitForSelector('input[type="text"]')
//         await page.type('input[type="text"]', username);
//         await page.waitForSelector('input[type="password"]')
//         await page.type('input[type="password"]', password);
//         solve(page)
//         await delay(10000);
//         await page.waitForSelector('button[type="submit"]'),
//             await page.click('button[type=submit]'),
//             console.log('berhasil')
//             cookiesObject = await page.cookies(),
//             console.log('Halaman URL:', page.url()),
//             halaman = page.url(),
//             halaman2 = { halaman },
//             a[key].push(halaman2),
//             a[key].push({ session: cookiesObject }),
//             JSON.stringify(a)
//         solve.stop()
//     } catch (e) {
//         console.log(e)
//     }
//     return a
// }

const getPuppeterBondowosokab = async(username, password) => {
    var a = {}
    var key = 'halaman_bondowosokab'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const delay = time => new Promise(res=>setTimeout(res,time));
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('https://bondowosokab.go.id/admin/login');
        await navigationPromise;
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', username);
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
                // await delay(10000);
        await page.waitForSelector('button[type="submit"]'),
            // await page.click('button[type=submit]'),
            console.log('berhasil')
        // await Promise.all([
        //     page.waitForNavigation(), // The promise resolves after navigation has finished
        //         cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
        // ]);
        // await page.close();
        // page.waitForNavigation({ timeout: 0 }),
        Promise.all([
            // page.click('#submit_button'),
            await page.click('button[type=submit]'),
            await delay(2000),
            page.waitForNavigation({ timeout: 0 }),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
        // page.waitForNavigation({ timeout: 0 })
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
        //     return a
    } catch (e) {
        console.log(e)
    }
    // return a
}

const getPuppeterPpid = async(username, password) => {
    var a = {}
    var key = 'halaman_ppid'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const delay = time => new Promise(res=>setTimeout(res,time));
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('https://ppid.bondowosokab.go.id/admin/login');
        await navigationPromise;
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', username);
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
        await page.waitForSelector('button[type="submit"]'),
            // await page.click('button[type=submit]'),
            console.log('berhasil')
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
        Promise.all([
            // page.click('#submit_button'),
            await page.click('button[type=submit]'),
            await delay(3000),
            page.waitForNavigation({ timeout: 0 }),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
    } catch (e) {
        console.log(e)
    }
    // return a
}

const getPuppeterBondowosoku = async(username, password) => {
    var a = {}
    var key = 'halaman_bondowosoku'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const delay = time => new Promise(res=>setTimeout(res,time));
    try {
        await page.setViewport({ width: 1366, height: 1000});
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('http://bondowosoku.bondowosokab.go.id/admin/login');
        await navigationPromise;
        await delay(1500)
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', username);
        await delay(1500)
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
        await delay(1500)
        await page.waitForSelector('input[type="submit"]'),
            await page.click('input[type=submit]'),
            console.log('berhasil')
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
        Promise.all([
            // page.click('#submit_button'),
            page.waitForNavigation({ timeout: 0 }),
            // await delay(5000),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
    } catch (e) {
        console.log(e)
    }
    // return a
}

const getPuppeterSibuba = async(username, password) => {
    var a = {}
    var key = 'halaman_sibuba'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const delay = time => new Promise(res=>setTimeout(res,time));
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('http://sibuba.bondowosokab.go.id/');
        await navigationPromise;
        await page.waitForSelector('input[type="email"]')
        await page.type('input[type="email"]', username);
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
        await page.waitForSelector('button[type="submit"]'),
            // await page.click('button[type=submit]'),
            console.log('berhasil')
        Promise.all([
            // page.click('#submit_button'),
            await page.click('button[type=submit]'),
            await delay(3000),
            page.waitForNavigation({ timeout: 0 }),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
    } catch (e) {
        console.log(e)
    }
    // return a
}

const getPuppeterSaid = async(username, password) => {
    var a = {}
    var key = 'halaman_said'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const delay = time => new Promise(res=>setTimeout(res,time));
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.setViewport({ width: 1366, height: 1000});
        await page.goto('https://said.bondowosokab.go.id/auth/login');
        await navigationPromise;
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', username);
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
        await page.waitForSelector('button[type="submit"]'),
            // await page.click('button[type=submit]'),
            console.log('berhasil')
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
        Promise.all([
            // page.click('#submit_button'),
            await page.click('button[type=submit]'),
            await delay(3000),
            page.waitForNavigation({ timeout: 0 }),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
    } catch (e) {
        console.log(e)
    }
    // return a

    // var a = {}
    // var key = 'halaman_said'
    // a[key] = []
    // var halaman
    // var halaman2
    // var cookiesObject
    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    // const delay = time => new Promise(res=>setTimeout(res,time));
    // try {
    //     const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
    //     await page.goto('https://said.bondowosokab.go.id/auth/login');
    //     await navigationPromise;
    //     await page.waitForSelector('input[type="text"]')
    //     await page.type('input[type="text"]', username);
    //     await page.waitForSelector('input[type="password"]')
    //     await page.type('input[type="password"]', password);
    //     await page.waitForSelector('button[type="submit"]'),
    //         await page.click('button[type=submit]'),
    //         console.log('berhasil')
    //     page.waitForNavigation({ timeout: 0 }),
    //         cookiesObject = await page.cookies(),
    //         console.log('Halaman URL:', page.url()),
    //         halaman = page.url(),
    //         halaman2 = { halaman },
    //         a[key].push(halaman2),
    //         a[key].push({ session: cookiesObject }),
    //         JSON.stringify(a)
    // } catch (e) {
    //     console.log(e)
    // }
    // return a
}

const getPuppeterSinka = async(username, password) => {
    var a = {}
    var key = 'halaman_sinka'
    a[key] = []
    var halaman
    var halaman2
    var cookiesObject
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const delay = time => new Promise(res=>setTimeout(res,time));
    try {
        const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto('http://sinka.bondowosokab.go.id');
        await navigationPromise;
        await page.waitForSelector('input[type="text"]')
        await page.type('input[type="text"]', username);
        await page.waitForSelector('input[type="password"]')
        await page.type('input[type="password"]', password);
        await page.waitForSelector('button[type="submit"]'),
            // await page.click('button[type=submit]'),
            console.log('berhasil')
        Promise.all([
            // page.click('#submit_button'),
            await page.click('button[type=submit]'),
            await delay(3000),
            page.waitForNavigation({ timeout: 0 }),
            cookiesObject = await page.cookies(),
            console.log('Halaman URL:', page.url()),
            halaman = page.url(),
            halaman2 = { halaman },
            a[key].push(halaman2),
            a[key].push({ session: cookiesObject }),
            JSON.stringify(a),
        ])
        return a
        // page.waitForNavigation({ timeout: 0 }),
        //     cookiesObject = await page.cookies(),
        //     console.log('Halaman URL:', page.url()),
        //     halaman = page.url(),
        //     halaman2 = { halaman },
        //     a[key].push(halaman2),
        //     a[key].push({ session: cookiesObject }),
        //     JSON.stringify(a)
    } catch (e) {
        console.log(e)
    }
    // return a
}

const getRekap = async(skpd_id) => {
    var datarekap = []
    const skpd = await prisma.data_satker.findMany({
            where: {
                skpd_id: skpd_id,
            },
            select: {
                code: true
            }
        })
        // console.log(skpd)

    var pemda = ['0103', '010301', '010302', '010303', '0104', '010401', '010402', '010403', '0105', '010501', '010502', '010503', '02', '0212', '021201', '02120101', '0212010101', '0212010102', '0212010103', '02120102', '0212010201', '0212010202', '0212010203', '02120103',
        '0212010301', '0212010302', '0212010303', '021202', '02120201', '0212020101', '0212020102', '0212020103', '02120202', '0212020201',
        '0212020202', '0212020203', '02120203', '0212020301', '0212020302', '0212020303', '021203', '02120301', '0212030101', '0212030102',
        '0212030103', '02120302', '0212030201', '0212030202', '0212030203', '02120303', '0212030301', '0212030302', '0212030303', '0213',
        '021301', '021302', '021303',
        '021301', '021302',
        '021303', '33', '3301', '330101',
        '330102', '3302', '330201', '330202',
        '3303', '330301', '330302', '3304',
        '330401', '330402', '02120304'
    ]

    var rsu = ["160901"]
    var querypensiun = ['PENSIUN', 'PENSIUN DINI', 'WAFAT', 'MUTASI', 'TEWAS', 'DIBERHENTIKAN DENGAN HORMAT', 'DIBERHENTIKAN DENGAN TIDAK HORMAT', 'PENSIUN DINI', 'HAPUS']
    const ids = skpd.map((skpd) => skpd.code);
    // console.log(ids)
    const pegawai = await prisma.data_pegawai.findMany({
        where: {
            AND: {
                satker_id: { in: ids },
                // satker_id: { in: pemda },
                unique_device: {
                    not: "#"
                },
                status_id: {
                    not: { in: querypensiun }
                }
            },
        },
    })


    const pegawai2 = await prisma.data_pegawai.findMany({
        where: {
            AND: {
                satker_id: { in: ids },
                // satker_id: { in: pemda },
                unique_device: '#',
                status_id: {
                    not: { in: querypensiun }
                }
            },
        },
    })

    const idpeg = pegawai.map((pegawai) => pegawai.id);
    const absensi = await prisma.sipp_presensi.findMany({
        where: {
            pegawai_id: { in: idpeg }
        },
        select: {
            pegawai_id: true
        }
    })

    const absen = absensi.map((absensi) => absensi.pegawai_id);
    const filtered = absen.filter((a, b) => absen.indexOf(a) === b)
    const belumabsen = await prisma.data_pegawai.findMany({
        where: {
            AND: {
                id: {
                    not: { in: filtered
                    },
                },
                satker_id: { in: ids },
                status_id: {
                    not: "PENSIUN"
                }
            }
        },
        select: {
            id: true
        }
    })

    const sudahabsen = await prisma.data_pegawai.findMany({
        where: {
            AND: {
                id: { in: filtered
                },
                unique_device: {
                    not: "#"
                },
                satker_id: { in: ids },
                status_id: {
                    not: "PENSIUN"
                }
            }
        },
    })

    pegawai.forEach(pegawai => {
        datarekap.push({...pegawai, sudah_registrasi: 'YA' })
    })
    pegawai2.forEach(pegawai => {
        datarekap.push({...pegawai, sudah_registrasi: 'BELUM' })
    })

    belumabsen.forEach(belumabsen => {
        if (belumabsen.id) {
            index = datarekap.findIndex(x => x.id === belumabsen.id);
            datarekap[datarekap.findIndex(obj => obj.id === belumabsen.id)] = {...datarekap[index], sudah_absen: 'BELUM' }
        }
    })

    sudahabsen.forEach(sudahabsen => {
        if (sudahabsen.id) {
            index = datarekap.findIndex(x => x.id === sudahabsen.id);
            datarekap[datarekap.findIndex(obj => obj.id === sudahabsen.id)] = {...datarekap[index], sudah_absen: 'YA' }
        }
    })

    return datarekap
}

///////////generate////////////////////
const generateSibuba = async(user, username, password) => {
    const nama = user
    console.log(nama)
    var datapegawai = [
    {
    "nama": "wowow@gmail.com",
    "username": "INDRA DWI CAHYONO"
    },
    ]
    for(var i = 0; i < datapegawai.length; i++){
        const res = await prisma.$queryRaw`
        SELECT * FROM data_pegawai 
        WHERE nama_asn LIKE ${`%${datapegawai[i].username}%`}
        AND jabatan_description LIKE '%bidan%'
        LIMIT 1
        ;`

        if(res.length != 0){
            const caripegawai = await prisma.user.findMany({
                where: {
                    username: res[0].nip
                },
                select: {
                    id: true
                }
            })

            var passwordhash, fullname, photo, pegawaiid
            const salt = await bcrypt.genSalt(13);
            if(caripegawai.length == 0){
                const caridatapegawai = await prisma.data_pegawai.findMany({
                    where: {
                        nip: res[0].nip
                    },
                    select: {
                        id: true,
                        password_encoded: true,
                        nama_asn: true,
                        photo: true
                    }
                })
                fullname = caridatapegawai[0].nama_asn
                photo = caridatapegawai[0].photo
                pegawaiid = caridatapegawai[0].id.toString()
                var passwordhas = await bcrypt.hash(caridatapegawai[0].password_encoded, salt);
                passwordhash = passwordhas.replace("$2b$","$2y$")
                await prisma.user.create({
                    data: {
                        username: res[0].nip,
                        password_hash: passwordhash,
                        fullname: fullname,
                        auth_key: "-",
                        password_reset_token: "-",
                        status: "10",
                        email: "-",
                        role_id: "USER",
                        photo: photo,
                        pegawai_id: pegawaiid
                    }
                })
            }
            await prisma.user_apps.create({
                data: {
                    user_id: res[0].nip,
                    apps_id: 'sibuba'
                }
            })
            const cari = await prisma.user_apps.findMany({
                where: {
                    AND: {
                        user_id: res[0].nip,
                        apps_id: 'sibuba'
                    }
                },
                select: {
                    id: true
                }
            })
            const result = await prisma.user_apps_credentials.create({
                data: {
                    userapps_id: cari[0].id,
                    username: datapegawai[i].nama,
                    password: password,
                    srctoken: "-",
                    validtoken: "-"
                }
            })
            console.log(res[0].nip + 'Berhasil')
        }else{
            console.log('tidak ditemukan')
        }
        
    }
    return "sukses"
}

const generateSinka = async() => {
    var datapegawai = [
        {
        "nama": "indra@bkd.com",
        "username": "FAHRONI SYAMSUL ARIEF",
        "password": 123456,
        "satker": "ASISTEN"
        }
    ]
    for(var i = 0; i < datapegawai.length; i++){
        const satuankerja = await prisma.data_satker.findMany({
            where: {
                satuan_kerja: datapegawai[i].satker
            },
            select: {
                code: true
            }
        })
        var res
        if(satuankerja.length != 0){
            res = await prisma.$queryRaw`
            SELECT * FROM data_pegawai 
            WHERE nama_asn LIKE ${`%${datapegawai[i].username}%`}
            AND satker_id LIKE ${`${satuankerja[0].code}%`}
            LIMIT 1
            ;`
        }else{
            res = await prisma.$queryRaw`
            SELECT * FROM data_pegawai 
            WHERE nama_asn LIKE ${`%${datapegawai[i].username}%`}
            LIMIT 1
            ;`
        }

        if(res.length != 0){
            const caripegawai = await prisma.user.findMany({
                where: {
                    username: res[0].nip
                },
                select: {
                    id: true
                }
            })

            var passwordhash, fullname, photo, pegawaiid
            const salt = await bcrypt.genSalt(13);
            if(caripegawai.length == 0){
                const caridatapegawai = await prisma.data_pegawai.findMany({
                    where: {
                        nip: res[0].nip
                    },
                    select: {
                        id: true,
                        password_encoded: true,
                        nama_asn: true,
                        photo: true
                    }
                })
                fullname = caridatapegawai[0].nama_asn
                photo = caridatapegawai[0].photo
                pegawaiid = caridatapegawai[0].id.toString()
                var passwordhas = await bcrypt.hash(caridatapegawai[0].password_encoded, salt);
                passwordhash = passwordhas.replace("$2b$","$2y$")
                await prisma.user.create({
                    data: {
                        username: res[0].nip,
                        password_hash: passwordhash,
                        fullname: fullname,
                        auth_key: "-",
                        password_reset_token: "-",
                        status: "10",
                        email: "-",
                        role_id: "USER",
                        photo: photo,
                        pegawai_id: pegawaiid
                    }
                })
            }
            await prisma.user_apps.create({
                data: {
                    user_id: res[0].nip,
                    apps_id: 'sinka'
                }
            })
            if(datapegawai[i].password != 0){
                const cari = await prisma.user_apps.findMany({
                    where: {
                        AND: {
                            user_id: res[0].nip,
                            apps_id: 'sinka'
                        }
                    },
                    select: {
                        id: true
                    }
                })
                const result = await prisma.user_apps_credentials.create({
                    data: {
                        userapps_id: cari[0].id,
                        username: datapegawai[i].nama,
                        password: datapegawai[i].password.toString(),
                        srctoken: "-",
                        validtoken: "-"
                    }
                })
                console.log(res[0].nip + 'Berhasil dengan password')
            }else{
                console.log(res[0].nip + 'Berhasil tanpa password')
            }
        }else{
            console.log('tidak ditemukan')
        }
    }
    return "sukses"
}

const generateSikda = async() => {
    var datapegawai = [
        {
        "username": "198912152019032006"
        }
    ]
    for(var i = 0; i < datapegawai.length; i++){
            const res = await prisma.$queryRaw`
            SELECT * FROM data_pegawai 
            WHERE nip LIKE ${`%${datapegawai[i].username}%`}
            LIMIT 1
            ;`

        if(res.length != 0){
            const caripegawai = await prisma.user.findMany({
                where: {
                    username: res[0].nip
                },
                select: {
                    id: true
                }
            })

            var passwordhash, fullname, photo, pegawaiid
            const salt = await bcrypt.genSalt(13);
            if(caripegawai.length == 0){
                const caridatapegawai = await prisma.data_pegawai.findMany({
                    where: {
                        nip: res[0].nip
                    },
                    select: {
                        id: true,
                        password_encoded: true,
                        nama_asn: true,
                        photo: true
                    }
                })
                fullname = caridatapegawai[0].nama_asn
                photo = caridatapegawai[0].photo
                pegawaiid = caridatapegawai[0].id.toString()
                var passwordhas = await bcrypt.hash(caridatapegawai[0].password_encoded, salt);
                passwordhash = passwordhas.replace("$2b$","$2y$")
                await prisma.user.create({
                    data: {
                        username: res[0].nip,
                        password_hash: passwordhash,
                        fullname: fullname,
                        auth_key: "-",
                        password_reset_token: "-",
                        status: "10",
                        email: "-",
                        role_id: "USER",
                        photo: photo,
                        pegawai_id: pegawaiid
                    }
                })
            }
            await prisma.user_apps.create({
                data: {
                    user_id: res[0].nip,
                    apps_id: 'sikda'
                }
            })
            console.log(res[0].nip + 'Berhasil')
        }else{
            console.log('tidak ditemukan')
        }
        
    }
    return "sukses"
}



// const puppeteerekstra2 = require('puppeteer-extra');
// const pluginStealth2 = require('puppeteer-extra-plugin-stealth')
// const solve2 = require('../helpers/index')
// const delay2 = time => new Promise(res=>setTimeout(res,time));
// var userAgent = require('user-agents');
// const getPuppeterBPJS = async(username, password) => {
//     puppeteerekstra.use(pluginStealth())
//     var a = {}
//     var key = 'halaman_bpjs'
//     a[key] = []
//     var halaman
//     var halaman2
//     var cookiesObject
//     const browser = await puppeteerekstra.launch({ headless: false, args: ['--window-size=360,800', '--window-position=000,000', '--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials'] });
//     const page = await browser.newPage();
//     await page.setUserAgent(userAgent.toString())
//     await page.setDefaultNavigationTimeout(30000)
//     const navigationPromise = page.waitForNavigation({ waitUntil: "domcontentloaded" });
//         page.goto('https://pcarejkn.bpjs-kesehatan.go.id/eclaim/Login');
//         navigationPromise;
//     try {
//         const emailInput = '[placeholder="Username"][autocomplete="off"]'
//         const emailWords = 'pkm_kotakulon'
//         await page.waitForSelector( emailInput, { timeout: 0 })
//         await page.focus(emailInput)
//         await page.keyboard.type(emailWords)

//         const passwordInput = 'input[placeholder="Password"][autocomplete="off"]'
//         const passwordWords = 'Kotakulon*910'
//         await page.waitForSelector( passwordInput, { timeout: 0 })
//         await page.focus(passwordInput)
//         await page.keyboard.type(passwordWords)
//         solve2(page)
        
//         await delay(10000);
//         // Promise.all([
//             // page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 1000000 }),
//             await page.waitForSelector('button[type="button"]'),
//             await page.click('button[type=button]'),
//             console.log('berhasil')
//             page.waitForNavigation({ timeout: 0 }),
//             cookiesObject = await page.cookies(),
//             console.log('Halaman URL:', page.url()),
//             halaman = page.url(),
//             halaman2 = { halaman },
//             a[key].push(halaman2),
//             a[key].push({ session: cookiesObject }),
//             JSON.stringify(a)
//         // ])
//         // await page.waitForSelector('button[type="button"]'),
//         //     await page.click('button[type=button]'),
//         //     console.log('berhasil')
//         //     page.waitForNavigation({ timeout: 0 }),
//         //     cookiesObject = await page.cookies(),
//         //     console.log('Halaman URL:', page.url()),
//         //     halaman = page.url(),
//         //     halaman2 = { halaman },
//         //     a[key].push(halaman2),
//         //     a[key].push({ session: cookiesObject }),
//         //     JSON.stringify(a)
//     } catch (e) {
//         console.log(e)
//     }
//     return a
// }


module.exports = {
    getSatker,
    logindashboard,
    cariPassword,
    cariCredentialsApps,
    cariCredentialsLogin,
    getPuppeterSipp,
    insertCredentials,
    getPuppeter,
    getPuppeterKeris,
    getPuppeterSipijar,
    getPuppeterSiabbagor,
    getPuppeterBondowosokab,
    getPuppeterPpid,
    getPuppeterBondowosoku,
    getPuppeterSibuba,
    getPuppeterSaid,
    getPuppeterSinka,
    getPuppeterSikda,
    getPuppeterEsurat,
    getRekap,
    insertDefault,
    generateSibuba,
    generateSinka,
    generateSikda,
    updatePegawaiPassword,
    getPuppeterUpload,
    uploadpameran,
    // getPuppeterBPJS
}