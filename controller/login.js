const Router=require('koa-router');
let router=new Router();
const Manager = require('../model/manager');
const { comparePass} = require('../method/index');
router.post('/account',async(ctx)=>{
    let data=ctx.request.body;
    const { password, userName } = data;
    let manager = new Manager();
    await manager.login({userName}).then( async (res) => {
        if(res.length !== 0){
            const [result] = res;
            const { password: pass, type, managerName, managerId, telephone, email } = result;
            const isTrue = await comparePass(password, pass);
            if(isTrue) {
                ctx.body={
                    status: 'ok',
                    type: 'account',
                    currentAuthority: type,
                    userdata:{
                        name: managerName,
                        type,
                        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                        id: managerId,
                        email,
                        phone: telephone,
                    }
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
    }).catch(err => {
        ctx.body={
            status: 'error',
            type: 'account',
            currentAuthority: 'guest',
        }
    })
})
module.exports=router;