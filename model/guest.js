var mysql = require('mysql');
var config = require('../config/default.js');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class Guest extends Sql{
    constructor () {
        super();
    }
    addGuest(str){
        return new Promise((resolve, reject) => {
            pool.query(str, function(error, results, fields){
                if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }
}
module.exports = Guest;