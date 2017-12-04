const csvtojson = require('csvtojson')
const fs = require('fs')

const csvFilePath = 'customer-data.csv'
const jsonFilePath  = 'customer-data.json'

let jsonArray = [];

csvtojson().fromFile(csvFilePath)
.on('json', (result) => {
    jsonArray.push(result)
}).on('done', (error) => {
    if (error) {
        console.log('Error : ', error)
        return
    }

    const jsonString = JSON.stringify(jsonArray, null, 2)
    fs.writeFileSync(jsonFilePath, jsonString, {'encoding': 'utf-8'})

    console.log('Completed.')
})