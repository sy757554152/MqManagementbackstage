var mysql = require('mysql');
var config = require('../config/default.js');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class StaffType extends Sql{
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

    addStaffType({staffTypeId, staffTypeName}){
        return new Promise((resolve, reject) => {
            pool.query(`insert into staffType (staffTypeId, staffTypeName) values ('${staffTypeId}','${staffTypeName}')`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }

    getStaffType(){
        return new Promise((resolve, reject) => {
            pool.query(`select * from staffType`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }
    deleStaffType({staffTypeId}){
        return new Promise((resolve, reject) => {
            pool.query(`delete from staffType where staffTypeId='${staffTypeId}'`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }
}
module.exports = StaffType;