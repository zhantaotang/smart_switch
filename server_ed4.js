// http_server.js 文件

'use strict'  // 使用最严格的语法

var http = require('http');  // 引入http模块。相当于C++中的include头文件
var url = require('url');
var util = require('util');
var fs = require('fs'); // 引入fs模块
var path=require("path")

var express=require('express');// 需要sudo npm install express安装
var serveIndex = require('serve-index');// 需要sudo npm install serve-index安装

var app = express();// 实例化

//app.use(serveIndex('./public')) // 预览目录
app.use(express.static(path.join(__dirname, 'public'))); // 发布静态目录的方法

// http server 创建http服务
var http_server=http.createServer(app);// 回调的时候，就会调用app，将参数传递给express，由express来处理

http_server.listen(8080, '0.0.0.0'); // 80端口，或者8080都可以。

app.get('/', function(req, res) {
    console.log("get a client request")
    //return the default
    res.sendFile(__dirname + "/public/guess_game.html")
})
