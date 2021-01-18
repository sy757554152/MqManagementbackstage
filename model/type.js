var mysql = require('mysql');
var config = require('../config/default.js');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class Type extends Sql{
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
    getAllType({type}){
        return new Promise((resolve, reject) => {
            pool.query(`select * from ${type}`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }

    deleType({type, value}){
        const { typeId, typeName } = value;
        return new Promise((resolve, reject) => {
            pool.query(`delete from ${type} where typeId='${typeId}' and typeName='${typeName}'`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }

    addType({type, name, id}){
        return new Promise((resolve, reject) => {
            pool.query(`insert into ${type} (typeId, typeName) values ('${id}','${name}')`, function(error, results, fields){
                if (error) {
                    throw error
                };
                resolve(results);
            })
        })
    }
}
module.exports = Type;