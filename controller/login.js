const Router=require('koa-router');
let router=new Router();
const Manager = require('../model/manager');
const { register, comparePass} = require('../method/index');
router.post('/account',async(ctx)=>{
    let data=ctx.request.body;
    const { password, userName } = data;
    let manager = new Manager();
    await manager.login({userName}).then( async (res) => {
        if(res.length !== 0){
            const [result] = res;
            const { password: pass, type } = result;
            const isTrue = await comparePass(password, pass);
            if(isTrue) {
                ctx.body={
                    status: 'ok',
                    type: 'account',
                    currentAuthority: type,
                }
            }else {
                ctx.body={
                    status: 'error',
                    type: 'account',
                    currentAuthority: 'guest',
                }
            }
        }else{
            ctx.body={
                status: 'error',
                type: 'account',
                currentAuthority: 'guest',
            }
        }
    })
})
module.exports=router;