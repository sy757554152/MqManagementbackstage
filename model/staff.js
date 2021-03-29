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
    addStaff({staffId, staffName, sex, information, staffPicUrl, staffTid}){
        return new Promise((resolve, reject) => {
        pool.query(`insert into staff (staffId, staffName, sex, information, staffPicUrl, staffTid) values('${staffId}','${staffName}','${sex}','${information}','${staffPicUrl}','${staffTid}')`, function(error, results, fields){
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
        pool.query(`select * from staff,staffType where staffTid=staffTypeId`, function(error, results, fields){
            if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }
    //删除员工
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
    //添加员工展示图片
    addStaffPic(str){
        return new Promise((resolve, reject) => {
            pool.query(str, function(error, results, fields){
                if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }

    getStaffPic({ staffId }){
        return new Promise((resolve, reject) => {
        pool.query(`select * from staffPic,staff  where staffPic.staffPid = staff.staffId and staff.staffId = '${staffId}'`, function(error, results, fields){
            if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }

    //删除员工展示图片
    deleStaffPic({staffPicId}){
        return new Promise((resolve, reject) => {
          pool.query(`delete from staffPic where staffPicId='${staffPicId}'`, function(error, results, fields){
            if (error) {
              throw error
            };
            resolve(results)
          })
        })
    }

    changeStaff({staffId, staffName, sex, information, staffPicUrl, staffTid}){
        return new Promise((resolve, reject) => {
        pool.query(`update staff set staffName='${staffName}', sex='${sex}', information='${information}', staffPicUrl='${staffPicUrl}', staffTid='${staffTid}' where staffId='${staffId}'`, function(error, results, fields){
            if (error) {
                throw error
            };
            resolve(results)
        })
        })
    }

    changeStaffPic({staffPicId, PicUrl, PicCompressUrl}){
        return new Promise((resolve, reject) => {
        pool.query(`update staffPic set PicUrl='${PicUrl}', PicCompressUrl='${PicCompressUrl}' where staffPicId='${staffPicId}'`, function(error, results, fields){
            if (error) {
                throw error
            };
            resolve(results)
        })
        })
    }
}
module.exports = Staff;