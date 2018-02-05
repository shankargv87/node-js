const dbConfig = require('./db-config.js')
const dataAccess = require('./data-access.js')
const async = require('async')
let customerDataArray = [];
let customerAddressDataArray = [];
let threadCounter = 0;

function getParallelTask(thread, parallelCount) {
    let tasks = [];
    let count = parallelCount + (parallelCount * thread);
    for(let index = count - parallelCount; index < count; index++) {
        tasks.push(function(callback) {
            let customerData = customerDataArray[index];
            let customerAddrData = customerAddressDataArray[index];
            customerData.country = customerAddrData.country;
            customerData.city = customerAddrData.city;
            customerData.state = customerAddrData.state;
            customerData.phone = customerAddrData.phone;
            dataAccess.updateCustomerData(customerData, callback);
        })
    }
    return tasks;
}

function migrate(parallel) {
    if(threadCounter == threadCount) {
        console.log('Migration Completed');
    }
    else {
        var parallelTasks = getParallelTask(threadCounter, parallel)
        async.parallel(parallelTasks, function(error, results) {
            threadCounter+=1;
            let updatedCount = 0;
            let updatedRecords = results.find((element) => {
                if(element.result.nModified == 1) {
                    updatedCount += 1;
                }
            })
            console.log(`Updated count for batch ${threadCounter}:: `, updatedCount)
            migrate(parallel);
        })
    }
}

function process() {
    let parallel = dbConfig.numberOfRecords / threadCount;
    console.log('Parallel queries per batch :: ', parallel);

    dataAccess.connectDatabase(() => {
        dataAccess.getCustomerAddressData((data) => {
            customerAddressDataArray = data;

            dataAccess.getCustomerData((custdata) => {
                customerDataArray = custdata;

                migrate(parallel);
            })
        })
    });
}

let threadCount = dbConfig.defaultCount;

if(global.process.argv.length > 2) {
    threadCount = parseInt(global.process.argv[2])
    console.log('Batch Size :: ', threadCount);
}

process()