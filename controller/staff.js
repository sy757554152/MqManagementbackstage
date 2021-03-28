const Router=require('koa-router');
let router=new Router();
const Staff = require('../model/staff');
const path=require('path')
const fs=require('fs');
const { domainName } = require('../config/domain');
const { delePicFile } = require('../method/index');
const images = require('images');

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

router.post('/addStaffPic',async(ctx)=>{
    const data = ctx.request.body;
    const { staffPid, staffPicId } = data;
    const fileList = ctx.request.files; // 获取上传文件

    let sql = 'insert into staffpic (staffPicId, staffPid, PicUrl, PicCompressUrl) values';
    let arrUrl = [];
    for (var item in fileList){
        let file = fileList[item];
        let PicUrl = domainName + `${staffPicId}${file.name}`;
        let PicCompressUrl = domainName + `${staffPicId}Compress${file.name}`;
        arrUrl.push(`('${staffPicId}${item}','${staffPid}','${PicUrl}','${PicCompressUrl}')`);
    }
    for(let i = 0; i < arrUrl.length; i++){
        if(i+1 === arrUrl.length){
            sql = sql + arrUrl[i];
        }else {
            sql = sql + arrUrl[i] + `,`;
        }
    }
    const staff = new Staff();
    await staff.addStaffPic(sql).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
            for (var item in fileList){
                let file = fileList[item];
                // 创建可读流
                let reader = fs.createReadStream(file.path);
                let filePath = path.join(__dirname, '../images') + `/${staffPicId}${file.name}`;
                let fileCompressPath = path.join(__dirname, '../images') + `/${staffPicId}Compress${file.name}`;
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

router.get('/getStaffPic',async(ctx) => {
    const data = ctx.query;
    const { staffId } = data;
    const staff = new Staff();
    await staff.getStaffPic({staffId}).then(res => {
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

router.post('/deleStaffPic',async(ctx)=>{
    const data = ctx.request.body;
    const { staffPicId, PicUrl, PicCompressUrl } = data;
    const staff = new Staff();
    await staff.deleStaffPic({staffPicId}).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
            delePicFile(PicUrl);
            delePicFile(PicCompressUrl);
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

router.post('/changeStaff',async(ctx)=>{
    const data = ctx.request.body;
    const { staffId, staffName, sex, information, isPicChange } = data;
    let { staffPicUrl } = data;
    const staff = new Staff();
    if(isPicChange === 'true'){
        const file = ctx.request.files.file; // 获取上传文件
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        let filePath = path.join(__dirname, '../images') + `/${staffId}${file.name}`;
        const otherStaffPicUrl = domainName + `${staffId}${file.name}`;
        await staff.changeStaff({staffId, staffName, sex, information, staffPicUrl:otherStaffPicUrl}).then(res =>{
            const { protocol41 = false} = res;
            if(protocol41){
                // 创建可写流
                const upStream = fs.createWriteStream(filePath);
                // 可读流通过管道写入可写流
                reader.pipe(upStream);
                delePicFile(staffPicUrl);
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
    else{
        await staff.changeStaff({staffId, staffName, sex, information, staffPicUrl}).then(res =>{
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

router.post('/changeStaffPic',async(ctx)=>{
    const data = ctx.request.body;
    const { staffPicId, PicUrl, PicCompressUrl, isPicChange } = data;
    const staff = new Staff();
    if(isPicChange === 'true'){
        const file = ctx.request.files.file; // 获取上传文件
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        let filePath = path.join(__dirname, '../images') + `/${staffPicId}${file.name}`;
        let fileCompressPath = path.join(__dirname, '../images') + `/${staffPicId}Compress${file.name}`;
        let otherPicUrl = domainName + `${staffPicId}${file.name}`;
        let otherPicCompressUrl = domainName + `${staffPicId}Compress${file.name}`;
        await staff.changeStaffPic({staffPicId, PicUrl: otherPicUrl, PicCompressUrl: otherPicCompressUrl}).then(res =>{
            const { protocol41 = false} = res;
            if(protocol41){
                if(otherPicUrl === PicUrl){
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
                    delePicFile(PicUrl);
                    delePicFile(PicCompressUrl);
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
        await staff.changeStaffPic({staffPicId, PicUrl, PicCompressUrl}).then(res =>{
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