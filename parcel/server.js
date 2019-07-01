const Koa =require('koa');
const serve=require('koa-static'); //代表启动静态文件的资源
const {resolve}=require('path');

const app=new Koa();

app.use(serve(resolve(__dirname,'./')));

app.listen(4466);
