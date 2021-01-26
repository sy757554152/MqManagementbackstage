var mysql = require('mysql');
var config = require('../config/default.js');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class Video extends Sql{
    constructor () {
        super();
    }
    addVideo(str){
        return new Promise((resolve, reject) => {
            pool.query(str, function(error, results, fields){
                if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }

    getVideo(){
        return new Promise((resolve, reject) => {
        pool.query(`select * from video,videotype,staff where video.type=videotype.typeId and video.staffId=staff.staffId`, function(error, results, fields){
            if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }

    //删除
    deleVideo({videoId}){
        return new Promise((resolve, reject) => {
          pool.query(`delete from video where videoId='${videoId}'`, function(error, results, fields){
            if (error) {
              throw error
            };
            resolve(results)
          })
        })
    }
}
module.exports = Video;