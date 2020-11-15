const bcrypt = require('bcrypt');
const saltRounds = 10;
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
module.exports = {
    register,
    comparePass,
}