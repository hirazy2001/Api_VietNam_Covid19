const cheerio = require('cheerio');
const puppeteer = require('puppeteer')
const mySQL = require('mysql')
const schedule = require('node-schedule')
const express = require('express')

const host = process.env.host

// const axios = require('axios')

// // const {jsdom} = require('jsdom')

const { JSDOM } = require('jsdom')
    // const db = mySQL.createConnection({
    //     host: 'localhost',
    //     user: 'zvesrhus_hirazy',
    //     password: 'a01649129388@',
    //     database: 'api-covid-19'
    // })

// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log('MySQL connected')
// })

// ORM


// var task = cron.schedule('* * * * *', () =>  {
//   console.log('will execute every minute until stopped');
// });

let data = schedule.scheduleJob({ hour: 0, minute: 0 }, async() => {
    let trackerData = await getdatavn()
        // Save to database

    // squelize.save
})

// const PORT = process.env.PORT || 1337

// app.get('/', async (req, res) => {
//     let info = await getInfo()
//     let result = await apiTracker(info)
//     await res.json(result)
// })

// app.listen(3000, ()=>{
//     console.log("Hehe")
// })

const axios = require('axios');
const fs = require('fs');
const idProfile = "620ddcf8d9863b1f18f2f371"

const url = 'https://vnexpress.net/covid-19/covid-19-viet-nam'

const urlSource = 'https://covid19.gov.vn/'


async function getdatavn() {

    // got(url).then(response => {
    //     const dom = new JSDOM(response.body);
    //     console.log(dom.window.document.querySelector('title').textContent);
    // }).catch(err => {
    //     console.log(err);
    // });

    // const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    // const page = await browser.newPage()
    // await page.goto(urlSource, { waitUntil: 'networkidle2' })

    // await page.setDefaultNavigationTimeout(60000);

    // while (true) {
    //     await sleep(1000)
    //     if (await page.$('div[class="tbody"]') != null) {
    //         break;
    //     }
    // }

    // const textContentPage = await page.content()

    // console.log(textContentPage)

    // let provinces = []

    // const dom = new JSDOM(textContentPage).window.document

    // const monthItems = dom.querySelector('.tbody')
    // const monthItemsList = monthItems.querySelectorAll('.row')
    // console.log(`Length ${monthItemsList.length}`)

    // let earningLists = []

    // for (let i = 0; i < monthItemsList.length; i++) {
    //     const item = monthItemsList[i]
    //     const cityEle = item.querySelector(`.city`).textContent
    //     console.log(cityEle)
    // }

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle2' })

    await page.setDefaultNavigationTimeout(60000);

    while (true) {
        await sleep(1000)
        if (await page.$('ul[class="list-tinhthanh"] > li') != null) {
            break;
        }
    }

    const textContentPage = await page.content()

    let provinces = []

    const dom = new JSDOM(textContentPage).window.document

    const provinceItemsSelector = dom.querySelector('#list-tinhthanh')
    const provinceItems = provinceItemsSelector.querySelectorAll('li')
    console.log(`Length ${provinceItems.length}`)

    for (let i = 0; i < provinceItems.length; i++) {
        const item = provinceItems[i]

        const newInfections = item.getAttribute('data-score')
        const province = item.querySelector('div:nth-child(1)').textContent
        const allInfections = item.querySelector('div:nth-child(2)').textContent
        const death = item.querySelector('div:nth-child(5)').textContent

        const provinceItem = {
            name: province,
            death: death,
            cases: allInfections,
            casesToday: newInfections
        }

        provinces.push(provinceItem)
    }


    // let nhiem = await page.evaluate(() => {
    //     return document.querySelector('div.block-data-vietnam > div.block-count-vietnam > div.item-nhiem').innerText
    // })
    // nhiem = nhiem.split('\n')
    // nhiem.shift()

    // let khoi = await page.evaluate(() => {
    //     return document.querySelector('div.block-data-vietnam > div.block-count-vietnam > div.item-khoi').innerText
    // })
    // khoi = khoi.split('\n')
    // khoi.shift()

    // let tuvong = await page.evaluate(() => {
    //     return document.querySelector('div.block-data-vietnam > div.block-count-vietnam > div.item-tuvong').innerText
    // })
    // tuvong = tuvong.split('\n')
    // tuvong.shift()

    // let capnhat = await page.evaluate(() => {
    //     return document.querySelector('div.container > div.red.center.mb20').innerText
    // })
    // capnhat = capnhat.slice(32).trim()

    // const tong = { nhiem: nhiem[0], khoi: khoi[0], tuvong: tuvong[0] }
    // const homnay = { nhiem: nhiem[1].slice(17), khoi: khoi[1].slice(17), tuvong: tuvong[1].slice(17) }
    // const covid = {
    //     'CovidVN': {
    //         'CapNhat': capnhat,
    //         'Tong': tong,
    //         'HomNay': homnay
    //     }
    // }

    // await page.click('div[class="btn-load btn-load--tinhthanh"] > a[class="xem-them"]')

    // // const provinceItems = await page.evaluate(() => {
    // //     const tds = Array.from(document.querySelectorAll('ul[class="list-tinhthanh"] > li'))
    // //     return tds.map(td => td.textContent)
    // // });
    // const provinceItems = await page.$$('ul[class="list-tinhthanh"] li')

    // let provinces = []

    // console.log(provinceItems.length)

    // for (const item of provinceItems) {

    //     const city = await item.$eval('div:nth-child(1)', element => element.textContent)
    //     const total = await item.$eval('div:nth-child(2)', element => element.textContent)
    //     const daynow = await item.$eval('div:nth-child(3) > strong', element => element.textContent)
    //     const die = await item.$eval('div:nth-child(5)', element => element.textContent)

    //     provinces.push({
    //         city: city,
    //         total: total,
    //         daynow: daynow,
    //         die: die
    //     })
    // }

    await browser.close()

    return provinces
}


function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


const app = express();
const port = 3000;

app.get('/', function(req, res) {
    res.send('<h1><a href="./api/">start</a></h1>')
});

app.get('/api/', async(req, res) => {
    try {
        const vietnam = await getdatavn();
        return res.status(200).json({
            result: vietnam,
        })
    } catch (e) {
        return res.status(500).json({
            e: e.toString(),
        })
    }
});

app.listen(process.env.PORT || port, () => console.log(`Example app listening at http://localhost:${port}`));