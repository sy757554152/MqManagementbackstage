const Router=require('koa-router');
let router=new Router();
const mysql = require('../mysql')
router.post('/insertUser',async(ctx)=>{
    let data=ctx.request.body;
    await mysql.insertUser(data).then(res=>{
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