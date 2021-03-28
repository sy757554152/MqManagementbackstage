const Router=require('koa-router');
let router=new Router();
const Guest = require('../model/guest');
const path=require('path')
const fs=require('fs');
const { domainName } = require('../config/domain');
const images = require('images');
const { delePicFile } = require('../method/index');
const User = require('../model/user');
const Worker = require('../model/worker');

router.post('/addGuest',async(ctx)=>{
    const data = ctx.request.body;
    const { guestId, type, date, staffId, userId } = data;
    const fileList = ctx.request.files; // 获取上传文件

    let sql = 'insert into guest (guestId, type, picUrl, picCompressUrl, date, staffId, userId) values';
    let arrUrl = [];
    for (var item in fileList){
        let file = fileList[item];
        let picUrl = domainName + `${guestId}${file.name}`;
        let picCompressUrl = domainName + `${guestId}Compress${file.name}`;
        arrUrl.push(`('${guestId}${item}','${type}','${picUrl}','${picCompressUrl}','${date}','${staffId}','${userId}')`);
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
    const data = ctx.query;
    const { userId } = data;
    const guest = new Guest();
    await guest.getGuest({userId}).then(res => {
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
    await guest.deleGuest({guestId}).then(res =>{
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

router.get('/getUserList',async(ctx) => {
    const user = new User();
    await user.getUser().then(res => {
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

router.post('/deleUser',async(ctx)=>{
    const data = ctx.request.body;
    const { userId } = data;
    const user = new User();
    await user.deleUser({userId}).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
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

router.post('/searchUser',async(ctx)=>{
    const data = ctx.request.body;
    const { value, searchType } = data;
    const user = new User();
    await user.searchUser({value, searchType}).then(res =>{
        ctx.body = {
            status: 'ok',
            data: res,
            message: '查找成功！',
        }
    }).catch(err=>{
        ctx.body = {
            status: 'error',
            message: '查找失败！',
        }
    })
})

router.post('/addUser',async(ctx)=>{
    const data = ctx.request.body;
    const { userId, date, userName, sex, phone } = data;
    const user = new User();
    await user.addUserList({userId, date, userName, sex, phone}).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
            ctx.body = {
                status: 'ok',
                message: '添加成功！',
            }
        }else {
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

router.get('/getWorker',async(ctx) => {
    const data = ctx.query;
    const { userId } = data;
    const worker = new Worker();
    await worker.getWorker({userId}).then(res => {
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

router.post('/changeUser',async(ctx)=>{
    const data = ctx.request.body;
    const { userId, date, userName, sex, phone, work } = data;
    const user = new User();
    const worker = new Worker();
    await user.changeUser({userId, date, userName, sex, phone}).then( async (res) =>{
        const { protocol41 = false} = res;
        if(protocol41){
            await worker.deleWorker({userId}).then(async (res) => {
                const { protocol41: flag = false} = res;
                if(flag){
                    let sql = 'insert into worker (title,userId,staffId) values';
                    let arr = [];
                    work.forEach((value) => {
                        const { title, staffId } = value;
                        arr.push(`('${title}','${userId}','${staffId}')`);
                    })
                    for(let i = 0; i < arr.length; i++){
                        if(i+1 === arr.length){
                            sql = sql + arr[i];
                        }else {
                            sql = sql + arr[i] + `,`;
                        }
                    }
                    await worker.addWorker(sql).then(res => {
                        const { protocol41: flag2 = false} = res;
                        if(flag2){
                            ctx.body ={
                                status: 'ok',
                                message: '修改成功!',
                            }
                        }else{
                            ctx.body = {
                                status: 'error',
                                message: '工作人员信息修改失败！',
                            }
                        }
                    }).catch(err => {
                        ctx.body = {
                            status: 'error',
                            message: '工作人员信息修改失败！',
                        }
                    })
                }else{
                    ctx.body = {
                        status: 'error',
                        message: '工作人员信息修改失败！',
                    }
                }
            }).catch(err => {
                ctx.body = {
                    status: 'error',
                    message: '工作人员信息修改失败！',
                }
            })
        }else {
            ctx.body = {
                status: 'error',
                message: '修改客户信息失败！',
            }
        }
        
    }).catch(err=>{
        ctx.body = {
            status: 'error',
            message: '修改信息失败！',
        }
    })
})

router.get('/searchGuest',async(ctx) => {
    const data = ctx.query;
    const { userId, picType } = data;
    const guest = new Guest();
    await guest.searchGuest({userId, type: picType}).then(res => {
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

router.post('/changeGuest',async(ctx)=>{
    const data = ctx.request.body;
    const { guestId, picUrl, picCompressUrl, isPicChange } = data;
    const guest = new Guest();
    if(isPicChange === 'true'){
        const file = ctx.request.files.file; // 获取上传文件
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        let filePath = path.join(__dirname, '../images') + `/${guestId}${file.name}`;
        let fileCompressPath = path.join(__dirname, '../images') + `/${guestId}Compress${file.name}`;
        let otherPicUrl = domainName + `${guestId}${file.name}`;
        let otherPicCompressUrl = domainName + `${guestId}Compress${file.name}`;
        await guest.changeGuest({guestId, picUrl: otherPicUrl, picCompressUrl: otherPicCompressUrl}).then(res =>{
            const { protocol41 = false} = res;
            if(protocol41){
                if(otherPicUrl === picUrl){
                    // 创建可写流
                    const upStream = fs.createWriteStream(filePath);
                    // 可读流通过管道写入可写流
                    reader.pipe(upStream);
                    images(file.path).save(fileCompressPath,{
                        quality: 50,
                    })
                }else{
                    // 创建可写流
                    const upStream = fs.createWriteStream(filePath);
                    // 可读流通过管道写入可写流
                    reader.pipe(upStream);
                    images(file.path).save(fileCompressPath,{
                        quality: 50,
                    })
                    delePicFile(picUrl);
                    delePicFile(picCompressUrl);
                }
                ctx.body = {
                    status: 'ok',
                    message: '修改成功!',
                }
            }else{
                ctx.body = {
                    status: 'error',
                    message: '修改失败！',
                }
            }
        }).catch(() => {
            ctx.body = {
                status: 'error',
                message: '修改失败！',
            }
        })
    }
    else{
        await guest.changeGuest({guestId, picUrl, picCompressUrl}).then(res =>{
            const { protocol41 = false} = res;
            if(protocol41){
                ctx.body = {
                    status: 'ok',
                    message: '修改成功!',
                }
            }else{
                ctx.body = {
                    status: 'error',
                    message: '修改失败！',
                }
            }
        }).catch(err=>{
            ctx.body = {
                status: 'error',
                message: '修改失败！',
            }
        })
    }
})

module.exports=router;