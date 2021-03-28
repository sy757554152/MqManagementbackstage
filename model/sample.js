var mysql = require('mysql');
var config = require('../config/default.js');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class Sample extends Sql{
    constructor () {
        super();
    }
    addSample(str){
        return new Promise((resolve, reject) => {
            pool.query(str, function(error, results, fields){
                if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }

    getSample({staffId}){
        return new Promise((resolve, reject) => {
        pool.query(`select * from sample,pictype,staff where sample.type=pictype.typeId and sample.staffId=staff.staffId and staff.staffId='${staffId}'`, function(error, results, fields){
            if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }

    //删除员工展示图片
    deleSample({sampleId}){
        return new Promise((resolve, reject) => {
          pool.query(`delete from sample where sampleId='${sampleId}'`, function(error, results, fields){
            if (error) {
              throw error
            };
            resolve(results)
          })
        })
    }

    changeSample({sampleId, picUrl, picCompressUrl}){
        return new Promise((resolve, reject) => {
        pool.query(`update sample set picUrl='${picUrl}', picCompressUrl='${picCompressUrl}' where sampleId='${sampleId}'`, function(error, results, fields){
            if (error) {
                throw error
            };
            resolve(results)
        })
        })
    }

    searchSample({picType,staffId}){
        return new Promise((resolve, reject) => {
        pool.query(`select * from sample,pictype,staff where sample.type=pictype.typeId and sample.staffId=staff.staffId and staff.staffId='${staffId}' and pictype.typeId='${picType}'`, function(error, results, fields){
            if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }
}
module.exports = Sample;