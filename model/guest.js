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

    getGuest({userId}){
        return new Promise((resolve, reject) => {
        pool.query(`select * from guest,pictype,staff,user where guest.type=pictype.typeId and guest.staffId=staff.staffId and user.userId=guest.userId and guest.userId='${userId}'`, function(error, results, fields){
            if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }

    //删除员工展示图片
    deleGuest({guestId}){
        return new Promise((resolve, reject) => {
          pool.query(`delete from guest where guestId='${guestId}'`, function(error, results, fields){
            if (error) {
              throw error
            };
            resolve(results)
          })
        })
    }

    searchGuest({userId, type}){
        return new Promise((resolve, reject) => {
          pool.query(`select * from guest,pictype,staff,user where guest.type=pictype.typeId and guest.staffId=staff.staffId and user.userId=guest.userId and guest.userId='${userId}' and guest.type='${type}'`, function(error, results, fields){
            if (error) {
              throw error
            };
            resolve(results)
          })
        })
    }

    changeGuest({guestId, picUrl, picCompressUrl}){
        return new Promise((resolve, reject) => {
        pool.query(`update guest set picUrl='${picUrl}', picCompressUrl='${picCompressUrl}' where guestId='${guestId}'`, function(error, results, fields){
            if (error) {
                throw error
            };
            resolve(results)
        })
        })
    }
}
module.exports = Guest;