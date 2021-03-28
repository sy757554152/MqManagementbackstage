var mysql = require('mysql');
var config = require('../config/default.js');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class User extends Sql{
    constructor () {
        super();
    }
    getWorker({userId}){
        return new Promise((resolve, reject) => {
            pool.query(`select title, staffName, worker.staffId from worker,staff where userId='${userId}' and staff.staffId=worker.staffId`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }

    deleWorker({userId}){
        return new Promise((resolve, reject) => {
            pool.query(`delete from worker where userId = '${userId}'`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }

    addWorker(str) {
        return new Promise((resolve, reject) => {
            pool.query(str, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }
}
module.exports = User;