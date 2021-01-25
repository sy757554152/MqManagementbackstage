var mysql = require('mysql');
var config = require('../config/default.js');
const Sql = require('./mysql')
const pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});
class Environment extends Sql{
    constructor () {
        super();
    }
    addEnvironment({ graphId, graphUrl, jumpUrl }){
        return new Promise((resolve, reject) => {
            pool.query(`insert into environment (graphId, graphUrl) values('${graphId}','${graphUrl}')`, function(error, results, fields){
                if (error) {
                throw error
                };
                resolve(results)
            })
        })
    }
}
module.exports = Environment;