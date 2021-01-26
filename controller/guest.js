const Router=require('koa-router');
let router=new Router();
const Guest = require('../model/guest');
const path=require('path')
const fs=require('fs');
const { domainName } = require('../config/domain');
const images = require('images');
const { delePicFile } = require('../method/index');

router.post('/addGuest',async(ctx)=>{
    const data = ctx.request.body;
    const { guestId, type, date, staffId, guestName } = data;
    const fileList = ctx.request.files; // 获取上传文件

    let sql = 'insert into guest (guestId, type, picUrl, picCompressUrl, date, staffId, guestName) values';
    let arrUrl = [];
    for (var item in fileList){
        let file = fileList[item];
        let picUrl = domainName + `${guestId}${file.name}`;
        let picCompressUrl = domainName + `${guestId}Compress${file.name}`;
        arrUrl.push(`('${guestId}${item}','${type}','${picUrl}','${picCompressUrl}','${date}','${staffId}','${guestName}')`);
    }
    for(let i = 0; i < arrUrl.length; i++){
        if(i+1 === arrUrl.length){
            sql = sql + arrUrl[i];
        }else {
            sql = sql + arrUrl[i] + `,`;
        }
    }
    const guest = new Guest();
    await guest.addGuest(sql).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
            for (var item in fileList){
                let file = fileList[item];
                // 创建可读流
                let reader = fs.createReadStream(file.path);
                let filePath = path.join(__dirname, '../images') + `/${guestId}${file.name}`;
                let fileCompressPath = path.join(__dirname, '../images') + `/${guestId}Compress${file.name}`;
                // 创建可写流
                const upStream = fs.createWriteStream(filePath);
                // 可读流通过管道写入可写流
                reader.pipe(upStream);
                images(file.path).save(fileCompressPath,{
                    quality: 50,
                })
            }
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

router.get('/getGuest',async(ctx) => {
    const guest = new Guest();
    await guest.getGuest().then(res => {
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

router.post('/deleGuest',async(ctx)=>{
    const data = ctx.request.body;
    const { guestId, picUrl, picCompressUrl } = data;
    const guest = new Guest();
    await guest.deleSample({guestId}).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
            delePicFile(picUrl);
            delePicFile(picCompressUrl);
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