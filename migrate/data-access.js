const mongodb = require('mongodb')
const dbConfig = require('./db-config.js')
let customerDataDb = null;
let customerAddressDataDb = null;
let connected = 0;

function connectDatabase(callback) {
    mongodb.MongoClient.connect(dbConfig.customerDataDb, (error, db) => {
        if(error) return process.exit(1)
        customerDataDb = db.db('customer-data-db');
        console.log('Customer Data Database connected')
        connected += 1;
        if(connected == 2) callback();
    })

    mongodb.MongoClient.connect(dbConfig.customerAddressDataDb, (error, db) => {
        if(error) return process.exit(1)
        customerAddressDataDb = db.db('customer-address-data-db');
        console.log('Customer Address Data Database connected')
        connected += 1;
        if(connected == 2) callback();
    })
}

function closeDatabase() {
    customerDataDb.close();
    customerAddressDataDb.close();
}

function getCustomerData(callback) {
    customerDataDb.collection('m3-customer-data').find({}).toArray((error, data) => {
        if(error) callback(null)
        callback(data)
    })
}

function getCustomerAddressData(callback) {
    customerAddressDataDb.collection('m3-customer-address-data').find({}).toArray((error, data) => {
        if(error) callback(null)
        callback(data)
    })
}

function updateCustomerData(input, callback) {
    customerDataDb.collection('m3-customer-data').update({_id: input._id}, {$set: input},
    (error, result) => {
        if(error) callback(error, result)
        callback(error, result)
    })
}

module.exports = {
    connectDatabase: connectDatabase,
    closeDatabase: closeDatabase,
    getCustomerData: getCustomerData,
    getCustomerAddressData: getCustomerAddressData,
    updateCustomerData: updateCustomerData
}