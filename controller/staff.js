const Router=require('koa-router');
let router=new Router();
const Staff = require('../model/staff');
const path=require('path')
const fs=require('fs');
const { domainName } = require('../config/domain');
const { delePicFile } = require('../method/index')

router.post('/addStaff',async(ctx)=>{
    const data = ctx.request.body;
    const { staffId, staffName, sex, information } = data;
    const file = ctx.request.files.file; // 获取上传文件
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(__dirname, '../images') + `/${staffId}${file.name}`;
    const staffPicUrl = domainName + `${staffId}${file.name}`;
    const staff = new Staff();
    await staff.addStaff({staffId, staffName, sex, information, staffPicUrl}).then(res =>{
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

router.get('/getStaff',async(ctx) => {
    const staff = new Staff();
    await staff.getStaff().then(res => {
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

router.post('/deleStaff',async(ctx)=>{
    const data = ctx.request.body;
    const { staffId,staffPicUrl } = data;
    const staff = new Staff();
    await staff.deleStaff({staffId}).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
            delePicFile(staffPicUrl);
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