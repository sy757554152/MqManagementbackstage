const Router=require('koa-router');
let router=new Router();
const Sample = require('../model/sample');
const path=require('path')
const fs=require('fs');
const { domainName } = require('../config/domain');
const images = require('images');
const { delePicFile } = require('../method/index');

router.post('/addSample',async(ctx)=>{
    const data = ctx.request.body;
    const { sampleId, type, date, staffId } = data;
    const fileList = ctx.request.files; // 获取上传文件

    let sql = 'insert into sample (sampleId, type, picUrl, picCompressUrl, date, staffId) values';
    let arrUrl = [];
    for (var item in fileList){
        let file = fileList[item];
        let picUrl = domainName + `${sampleId}${file.name}`;
        let picCompressUrl = domainName + `${sampleId}Compress${file.name}`;
        arrUrl.push(`('${sampleId}${item}','${type}','${picUrl}','${picCompressUrl}','${date}','${staffId}')`);
    }
    for(let i = 0; i < arrUrl.length; i++){
        if(i+1 === arrUrl.length){
            sql = sql + arrUrl[i];
        }else {
            sql = sql + arrUrl[i] + `,`;
        }
    }
    const sample = new Sample();
    await sample.addSample(sql).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
            for (var item in fileList){
                let file = fileList[item];
                // 创建可读流
                let reader = fs.createReadStream(file.path);
                let filePath = path.join(__dirname, '../images') + `/${sampleId}${file.name}`;
                let fileCompressPath = path.join(__dirname, '../images') + `/${sampleId}Compress${file.name}`;
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

router.get('/getSample',async(ctx) => {
    const data = ctx.query;
    const { staffId } = data;
    const sample = new Sample();
    await sample.getSample({staffId}).then(res => {
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

router.post('/deleSample',async(ctx)=>{
    const data = ctx.request.body;
    const { sampleId, picUrl, picCompressUrl } = data;
    const sample = new Sample();
    await sample.deleSample({sampleId}).then(res =>{
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

router.post('/changeSample',async(ctx)=>{
    const data = ctx.request.body;
    const { sampleId, picUrl, picCompressUrl, isPicChange } = data;
    const sample = new Sample();
    if(isPicChange === 'true'){
        const file = ctx.request.files.file; // 获取上传文件
        // 创建可读流
        const reader = fs.createReadStream(file.path);
        let filePath = path.join(__dirname, '../images') + `/${sampleId}${file.name}`;
        let fileCompressPath = path.join(__dirname, '../images') + `/${sampleId}Compress${file.name}`;
        let otherPicUrl = domainName + `${sampleId}${file.name}`;
        let otherPicCompressUrl = domainName + `${sampleId}Compress${file.name}`;
        await sample.changeSample({sampleId, picUrl: otherPicUrl, picCompressUrl: otherPicCompressUrl}).then(res =>{
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
        await sample.changeSample({sampleId, picUrl, picCompressUrl}).then(res =>{
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

router.get('/searchSample',async(ctx) => {
    const data = ctx.query;
    const { picType, staffId } = data;
    const sample = new Sample();
    await sample.searchSample({picType,staffId}).then(res => {
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

module.exports=router;