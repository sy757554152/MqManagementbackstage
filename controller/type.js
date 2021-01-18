const Router=require('koa-router');
let router=new Router();
const Type = require('../model/type');

router.get('/getAllType',async (ctx) => {
    const data = ctx.query;
    const { type } = data;
    const dataType = new Type();
    let value = '';
    if(type === 'picture'){
        value = 'pictype';
    }else if(type === 'video'){
        value = 'videotype';
    }else{
        ctx.body = {
            status: 'typeError',
            message: '类型错误!',
        }
    }
    await dataType.getAllType({type:value}).then(res => {
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

router.post('/deleType',async (ctx) => {
    const data = ctx.request.body;
    const { type, value: val } = data;
    const dataType = new Type();
    let value = '';
    if(type === 'picture'){
        value = 'pictype';
    }else if(type === 'video'){
        value = 'videotype';
    }else{
        ctx.body = {
            status: 'typeError',
            message: '类型错误!',
        }
    }
    await dataType.deleType({type:value, value:val}).then(res => {
        ctx.body = {
            status: 'ok',
            message: '删除成功！',
        }
    }).catch(err => {
        ctx.body = {
            status: 'error',
            message: '删除失败!',
        }
    })
});

router.post('/addType',async (ctx) => {
    const data = ctx.request.body;
    const { type, typeName, typeId } = data;
    const dataType = new Type();
    let value = '';
    if(type === 'picture'){
        value = 'pictype';
    }else if(type === 'video'){
        value = 'videotype';
    }else{
        ctx.body = {
            status: 'typeError',
            message: '类型错误!',
        }
    }
    await dataType.addType({type:value, name:typeName, id:typeId}).then(res => {
        ctx.body = {
            status: 'ok',
            message: '添加成功！',
        }
    }).catch(err => {
        ctx.body = {
            status: 'error',
            message: '添加失败!',
        }
    })
});

module.exports=router;