var mysql = require('mysql');
var config = require('../config/default.js');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class Staff extends Sql{
    constructor () {
        super();
    }
    //初始化 手动添加成员
    // insertManager({name, id, password, type, telephone, email}){
    //   return new Promise((resolve, reject) => {
    //     pool.query(`insert into Manager (managerName, managerId, password, type, telephone, email) values('${name}','${id}','${password}','${type}','${telephone}','${email}')`, function(error, results, fields){
    //       if (error) {
    //         throw error
    //       };
    //       resolve(results)
    //     })
    //   })
    // }

    //添加员工
    addStaff({staffId, staffName, sex, information, staffPicUrl}){
        return new Promise((resolve, reject) => {
        pool.query(`insert into staff (staffId, staffName, sex, information, staffPicUrl) values('${staffId}','${staffName}','${sex}','${information}','${staffPicUrl}')`, function(error, results, fields){
            if (error) {
            throw error
            };
            resolve(results)
        })
        })
    }

    //获取员工数据
    getStaff(){
        return new Promise((resolve, reject) => {
        pool.query(`select * from staff`, function(error, results, fields){
            if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }

    deleStaff({staffId}){
        return new Promise((resolve, reject) => {
          pool.query(`delete from staff where staffId='${staffId}'`, function(error, results, fields){
            if (error) {
              throw error
            };
            resolve(results)
          })
        })
      }
}
module.exports = Staff;