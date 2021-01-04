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
    insertManager({name, id, password, type, telephone, email}){
      return new Promise((resolve, reject) => {
        pool.query(`insert into Manager (managerName, managerId, password, type, telephone, email) values('${name}','${id}','${password}','${type}','${telephone}','${email}')`, function(error, results, fields){
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
        pool.query(`select password, type, managerName, managerId, telephone, email from Manager where managerId='${userName}'`, function(error, results, fields){
          if (error) {
            throw error
          };
          resolve(results)
        })
      })
    }

    //首页 获取用户信息
    homePage({ name,id }){
      return new Promise((resolve, reject) => {
        pool.query(`select managerName, managerId, telephone, email from Manager where managerId='${id}' and managerName='${name}'`, function(error, results, fields){
          if (error) {
            throw error
          };
          resolve(results)
        })
      })
    }

    //添加Manager
    searchManager({id}){
      return new Promise((resolve, reject) => {
        pool.query(`select * from Manager where managerId='${id}'`, function(error, results, fields){
          if (error) {
            throw error
          };
          resolve(results)
        })
      })
    }

    //查找所有Manager
    getAllManager({userid}){
      return new Promise((resolve, reject) => {
        pool.query(`select email,managerId,managerName,telephone,type from Manager where managerId not in ('${userid}')`, function(error, results, fields){
          if (error) {
            throw error
          };
          resolve(results)
        })
      })
    }

    //删除Manager
    deleManager({managerId}){
      return new Promise((resolve, reject) => {
        pool.query(`delete from Manager where managerId='${managerId}'`, function(error, results, fields){
          if (error) {
            throw error
          };
          resolve(results)
        })
      })
    }

    //修改密码
    changePassword({userid, password}){
      return new Promise((resolve, reject) => {
        pool.query(`update Manager set password = '${password}' where managerId='${userid}'`, function(error, results, fields){
          if (error) {
            throw error
          };
          resolve(results)
        })
      })
    }
}
module.exports = Manager;