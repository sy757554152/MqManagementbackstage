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

    getGuest(){
        return new Promise((resolve, reject) => {
        pool.query(`select * from guest,pictype,staff where guest.type=pictype.typeId and guest.staffId=staff.staffId`, function(error, results, fields){
            if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }

    //删除员工展示图片
    deleSample({guestId}){
        return new Promise((resolve, reject) => {
          pool.query(`delete from guest where guestId='${guestId}'`, function(error, results, fields){
            if (error) {
              throw error
            };
            resolve(results)
          })
        })
    }
}
module.exports = Guest;