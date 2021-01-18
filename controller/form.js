const Router=require('koa-router');
let router=new Router();
const Form = require('../model/form');

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
    const { formId } = value
    const form = new Form();
    await form.changeForm({value:formId}).then(res => {
        ctx.body = {
            status: 'ok',
            data: res,
            message: '修改成功！',
        }
    }).catch(err => {
        ctx.body = {
            status: 'error',
            message: '修改失败!',
        }
    })
});

module.exports=router;