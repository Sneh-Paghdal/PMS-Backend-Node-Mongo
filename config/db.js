const url = 'mongodb://192.168.29.8:27017';
//('mongodb://192.168.29.8:27017')
const mongoose = require('mongoose');
const connection = mongoose.createConnection('mongodb://localhost:27017/parkingmanagement')
.on('open',()=>{
    console.log('DB connected')
}).on('error', ()=>{
    console.log("Error occured")
});
module.exports = connection;