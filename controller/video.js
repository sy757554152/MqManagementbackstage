const Router=require('koa-router');
let router=new Router();
const Video = require('../model/video');
const path=require('path')
const fs=require('fs');
const { domainName } = require('../config/domain');

router.post('/addVideo',async(ctx)=>{
    const data = ctx.request.body;
    const { videoId, type, date, staffId } = data;
    const fileList = ctx.request.files; // 获取上传文件

    let sql = 'insert into video (videoId, type, videoUrl, date, staffId) values';
    let arrUrl = [];
    for (var item in fileList){
        let file = fileList[item];
        let videoUrl = domainName + `${videoId}${file.name}`;
        arrUrl.push(`('${videoId}${item}','${type}','${videoUrl}','${date}','${staffId}')`);
    }
    for(let i = 0; i < arrUrl.length; i++){
        if(i+1 === arrUrl.length){
            sql = sql + arrUrl[i];
        }else {
            sql = sql + arrUrl[i] + `,`;
        }
    }
    const video = new Video();
    await video.addVideo(sql).then(res =>{
        const { protocol41 = false} = res;
        if(protocol41){
            for (var item in fileList){
                let file = fileList[item];
                // 创建可读流
                let reader = fs.createReadStream(file.path);
                let filePath = path.join(__dirname, '../videos') + `/${videoId}${file.name}`;
                // 创建可写流
                const upStream = fs.createWriteStream(filePath);
                // 可读流通过管道写入可写流
                reader.pipe(upStream);
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

module.exports=router;