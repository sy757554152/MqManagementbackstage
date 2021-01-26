const Router=require('koa-router');
let router=new Router();
const Environment = require('../model/environment');
const path=require('path')
const fs=require('fs');
const { domainName } = require('../config/domain');
const { delePicFile } = require('../method/index');

router.post('/addEnvironment',async(ctx)=>{
    const data = ctx.request.body;
    const { graphId } = data;
    const file = ctx.request.files.file; // 获取上传文件
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, '../images') + `/${graphId}${file.name}`;
    const graphUrl = domainName + `${graphId}${file.name}`;
    const environment = new Environment();
    await environment.addEnvironment({ graphId, graphUrl }).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
            // 创建可写流
            const upStream = fs.createWriteStream(filePath);
            // 可读流通过管道写入可写流
            reader.pipe(upStream);
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

router.get('/getEnvironment',async(ctx) => {
    const environment = new Environment();
    await environment.getEnvironment().then(res => {
        if(res.length >= 0) {
            ctx.body = {
                status: 'ok',
                message: '查找成功!',
                data: res,
            }
        }else {
            ctx.body = {
                status: 'error',
                message: '查找失败!',
            }
        }
    }).catch(err => {
        ctx.body = {
            status: 'error',
            message: '查找失败！',
        }
    })
})

router.post('/deleEnvironment',async(ctx)=>{
    const data = ctx.request.body;
    const { graphId, graphUrl } = data;
    const environment = new Environment();
    await environment.deleEnvironment({graphId}).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
            delePicFile(graphUrl);
            ctx.body = {
                status: 'ok',
                message: '删除成功!',
            }
        }else{
            ctx.body = {
                status: 'error',
                message: '删除失败！',
            }
        }
    }).catch(err=>{
        ctx.body = {
            status: 'error',
            message: '删除失败！',
        }
    })
})

module.exports=router;