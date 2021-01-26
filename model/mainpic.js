var mysql = require('mysql');
var config = require('../config/default.js');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class MainPic extends Sql{
    constructor () {
        super();
    }
    addMainPic({ graphId, graphUrl, jumpUrl }){
        return new Promise((resolve, reject) => {
            pool.query(`insert into mainGraph (graphId, graphUrl, jumpUrl) values('${graphId}','${graphUrl}','${jumpUrl}')`, function(error, results, fields){
                if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }

    getMainPic(){
        return new Promise((resolve, reject) => {
        pool.query(`select * from maingraph`, function(error, results, fields){
            if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }

    //删除员工展示图片
    deleMainPic({graphId}){
        return new Promise((resolve, reject) => {
          pool.query(`delete from maingraph where graphId='${graphId}'`, function(error, results, fields){
            if (error) {
              throw error
            };
            resolve(results)
          })
        })
    }
}
module.exports = MainPic;