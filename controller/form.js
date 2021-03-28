const Router=require('koa-router');
let router=new Router();
const Form = require('../model/form');
const User = require('../model/user');

router.get('/getForm',async (ctx) => {
    const data = ctx.query;
    const { type } = data;
    const form = new Form();
    const value = type.toString();
    await form.getForm({type:value}).then(res => {
        ctx.body = {
            status: 'ok',
            data: res,
            message: '查找成功！',
        }
    }).catch(err => {
        ctx.body = {
            status: 'error',
            message: '查找失败!',
        }
    })
});

router.post('/deleForm',async (ctx) => {
    const data = ctx.request.body;
    const { value } = data;
    const { formId, customerName, customerPhone, sex } = value
    const form = new Form();
    const user = new User();
    await form.changeForm({value:formId}).then(async (res) => {
        await user.addUser({userId: formId, userName:customerName, phone:customerPhone, sex}).then(res => {
            const { protocol41 = false} = res;
            if(protocol41){
                ctx.body = {
                    status: 'ok',
                    message: '修改成功!',
                }
            }
        }).catch(err => {
            ctx.body = {
                status: 'error',
                message: '修改失败!',
            }
        })
    }).catch(err => {
        ctx.body = {
            status: 'error',
            message: '修改失败!',
        }
    })
});

router.get('/searchForm',async (ctx) => {
    const data = ctx.query;
    const form = new Form();
    await form.searchForm(data).then(res => {
        ctx.body = {
            status: 'ok',
            data: res,
            message: '查找成功！',
        }
    }).catch(err => {
        ctx.body = {
            status: 'error',
            message: '查找失败!',
        }
    })
});

module.exports=router;