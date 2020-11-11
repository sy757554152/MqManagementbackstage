var mysql = require('mysql');
var config = require('../config/default.js');
const { resolve } = require('path');

const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class Mysql {
    constructor () {

    }
    login(name,password,dbname,attrname) {//登录
      return new Promise((resolve, reject) => {
        pool.query(`SELECT * from ${dbname} where ${dbname}.${attrname}=${name} and ${dbname}.password=${password}`, function (error, results, fields) {
            if (error) {
                throw error
            };
            resolve(results)
        });
      })
       
    }
}

module.exports = new Mysql()