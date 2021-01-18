var mysql = require('mysql');
var config = require('../config/default.js');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class Form extends Sql{
    constructor () {
        super();
    }
    //查找
    getForm({type}){
      return new Promise((resolve, reject) => {
        pool.query(`select * from picType,form where formType=typeId and tag='${type}'`, function(error, results, fields){
          if (error) {
            throw error
          };
          resolve(results)
        })
      })
    }

    changeForm({value}){
      return new Promise((resolve, reject) => {
        pool.query(`update form set tag='true' where formId='${value}'`, function(error, results, fields){
          if (error) {
            throw error
          };
          resolve(results)
        })
      })
    }
}
module.exports = Form;