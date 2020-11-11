const Koa=require('koa');
const app=new Koa();
const koaBody = require('koa-body');
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 1024*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}));

//解决跨域
const cors =require('koa2-cors');
app.use(cors({
    origin:['http://localhost:9528'],
    credentials:true
}));

// 接受前端请求
const bodyParser=require('koa-bodyparser');
app.use(bodyParser());

//加载路由
const Router=require('koa-router');
let user=require('./controller/user');
let router=new Router();
router.use('/user',user.routes());
app.use(router.routes());
//限制只能接受post或get请求
app.use(router.allowedMethods());

//引入mysql文件 连接数据库
const config = require('./config/default')
const mysql = require('./mysql')
app.use(async (ctx)=>{
    // let data = await mysql.query();
    ctx.body = "实验";
})
app.listen(config.port,()=>{
    console.log('db-project-start')
})