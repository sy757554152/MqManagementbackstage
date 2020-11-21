const Router=require('koa-router');
let router=new Router();
const Manager = require('../model/manager');
const { register } = require('../method/index');
router.get('/insertManager',async(ctx)=>{
    const pass = await register('123456789');
    const data = {
        name: '石宇',
        id: 'sy757554152',
        password: pass,
        type: 'admin',
        telephone: '18855551111',
        email: '757554152@qq.com',
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
    }).catch(err => {
        ctx.body={
            code:201,
            message:'添加失败'
        }
    })
})
router.post('/homePage',async(ctx)=>{
    let data=ctx.request.body;
    const manager = new Manager();
    await manager.homePage(data).then(res =>{
        if(res.length !== 0){
            const [result] = res;
            const { managerName, managerId, telephone, email } = result;
            ctx.body={
                name: managerName,
                avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
                userid: managerId,
                email,
                phone: telephone,
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
router.post('/addManager',async(ctx)=>{
    let data=ctx.request.body;
    let { password } = data
    const pass = await register(password);
    password = pass;

    const manager = new Manager();
    await manager.insertManager(data).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
            ctx.body = {
                status: 'ok',
                message: '添加成功!',
            }
        }else{
            ctx.body = {
                status: 'error',
                message: '添加失败！',
            }
        }
    }).catch(err=>{
        ctx.body = {
            status: 'error',
            message: '添加失败！',
        }
    })
})
router.get('/searchManager',async(ctx)=>{
    let data = ctx.query;
    const id = data[0];
    const manager = new Manager();
    await manager.searchManager({id}).then(res =>{
        if(res.length >= 1){
            ctx.body={
                status: 'error',
                message: '查找失败!',
            }
        }else{
            ctx.body={
                status: 'ok',
                message: '查找成功!',
            }
        }
    }).catch(err => {
        ctx.body={
            status: 'error',
            message: '查找失败!',
        }
    })
})
module.exports=router;