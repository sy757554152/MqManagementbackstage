const Router=require('koa-router');
let router=new Router();
const Manager = require('../model/manager');
const { register } = require('../method/index');
router.get('/insertManager',async(ctx)=>{
    // let data=ctx.request.body;
    const pass = await register('123456789');
    const data = {
        name: '石宇',
        id: 'sy757554152',
        password: pass,
        type: 'admin',
        telephone: '18855551111',
        email: '757554152@qq.com',
        autoLogin: 'false',
    }
    const manager = new Manager();
    await manager.insertManager(data).then(res =>{
        if(res!=false){
            ctx.body={
                code:20000,
                message:'添加成功'
            }
        }else{
            ctx.body={
                code:201,
                message:'添加失败'
            }
        }
    })
})
module.exports=router;