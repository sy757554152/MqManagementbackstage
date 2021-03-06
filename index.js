const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const serve = require("koa-static");
const fs = require('fs');
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 1024*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
}));

app.use(serve(__dirname + "/client/dist"));
app.use(serve(__dirname + '/images'));
app.use(serve(__dirname + '/videos'));

//解决跨域
const cors = require('koa2-cors');
app.use(cors({
    origin:function(ctx) {
        const domainName = ['http://localhost:8000','http://localhost:8080']
        if(domainName.indexOf(ctx.header.origin) != -1) {
            return '*';
        }
        return false;
    },
    credentials:true
}));

// 接受前端请求
const bodyParser=require('koa-bodyparser');
app.use(bodyParser());

//加载路由
const Router = require('koa-router');
const manager = require('./controller/manager');
const login = require('./controller/login');
const form = require('./controller/form');
const type = require('./controller/type');
const staff = require('./controller/staff');
const mainPic = require('./controller/mainpic');
const environment = require('./controller/environment');
const sample = require('./controller/sample');
const guest = require('./controller/guest');
const video = require('./controller/video');
const router = new Router();
router.use('/user', manager.routes());
router.use('/login', login.routes());
router.use('/form', form.routes());
router.use('/type', type.routes());
router.use('/staff', staff.routes());
router.use('/mainpic', mainPic.routes());
router.use('/environment', environment.routes());
router.use('/sample', sample.routes());
router.use('/guest', guest.routes());
router.use('/video', video.routes());

router.get('/',(ctx, next) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('/client/dist/index.html');
});

app.use(router.routes());
//限制只能接受post或get请求
app.use(router.allowedMethods());

//引入mysql文件 连接数据库
const config = require('./config/default')
// app.use(async (ctx)=>{
//     ctx.body = "实验";
// })
app.listen(config.port,() => {
    console.log('db-project-start')
})