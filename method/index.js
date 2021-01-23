const bcrypt = require('bcrypt');
const saltRounds = 10;
const {domainName} = require('../config/domain');
const fs = require('fs');
const path = require('path');
// (async () => {
//     const myPlaintextPassword = '123456'; // 我的明文密码
//     const someOtherPlaintextPassword = 'not_bacon'; // 错误的密码
    
//     passHash = await register(myPlaintextPassword);
//     pass2 = await register(myPlaintextPassword);
//     const isTrue = await comparePass(myPlaintextPassword,pass2)
//     const isTrue2 = await comparePass(myPlaintextPassword,pass2)
//     let a = '$2b$10$pKWwSvaSaeOeF9mrcq.yEOvrLs//e4MQxt8Atd5ZDeTfOv98bjDAK';
//     const isTrue3 = await comparePass(myPlaintextPassword,a)
//     console.log(typeof pass2)
//     console.log(myPlaintextPassword,pass2)
//     console.log(isTrue,isTrue2,isTrue3)
//   })();
async function register(pass) {
    const saltRounds = 10;
    return bcrypt.hash(pass, saltRounds);
}
async function comparePass (pass,passDb) {
    return bcrypt.compare(pass, passDb)
}

function delePicFile(url) {
    const fileName = url.substr(domainName.length);
    let filePath = path.join(__dirname, '../images') + `/${fileName}`;
    fs.unlinkSync(filePath);
}
function deleVideoFile(url) {
    const fileName = url.substr(domainName.length);
    let filePath = path.join(__dirname, '../videos') + `/${fileName}`;
    fs.unlinkSync(filePath);
}
module.exports = {
    register,
    comparePass,
    delePicFile,
    deleVideoFile,
}