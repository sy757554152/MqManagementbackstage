var mysql = require('mysql');
var config = require('../config/default.js');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class User extends Sql{
    constructor () {
        super();
    }
    addUser({userId,userName,phone,sex}){
        return new Promise((resolve, reject) => {
            pool.query(`insert into user (userId, userName, phone, sex) values('${userId}','${userName}','${phone}','${sex}')`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }

    getUser(){
        return new Promise((resolve, reject) => {
            pool.query(`select user.userId,user.userName,date,user.sex,phone,title,worker.staffId,staffName from worker right join staff on worker.staffId= staff.staffId right join user on worker.userId = user.userId`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }

    addUserList({userId, userName, sex, phone, date}){
        return new Promise((resolve, reject) => {
            pool.query(`insert into user (userId, userName, sex, phone, date) values('${userId}','${userName}','${sex}','${phone}','${date}')`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }

    deleUser({userId}){
        return new Promise((resolve, reject) => {
            pool.query(`delete from user where userId='${userId}'`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }

    searchUser({value, searchType}){
        return new Promise((resolve, reject) => {
            pool.query(`select * from user where ${searchType}='${value}'`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }

    changeUser({userId, userName, sex, phone, date}){
        return new Promise((resolve, reject) => {
            pool.query(`update user set userName='${userName}', sex='${sex}', phone='${phone}', date='${date}' where userId='${userId}'`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }
}
module.exports = User;