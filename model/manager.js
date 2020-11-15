var mysql = require('mysql');
var config = require('../config/default.js');
const { resolve } = require('path');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class Manager extends Sql{
    constructor () {
        super();
    }
    //初始化 手动添加成员
    insertManager({name, id, password, type, telephone, email, autoLogin}){
      return new Promise((resolve, reject) => {
        pool.query(`insert into Manager (managerName, managerId, password, type, telephone, email, autoLogin) values('${name}','${id}','${password}','${type}','${telephone}','${email}','${autoLogin}')`, function(error, results, fields){
          if (error) {
            throw error
          };
          resolve(results)
        })
      })
    }

    //登录
    login({ userName }){
      return new Promise((resolve, reject) => {
        pool.query(`select password,type from Manager where managerId='${userName}'`, function(error, results, fields){
          if (error) {
            throw error
          };
          resolve(results)
        })
      })
    }
}
module.exports = Manager;