'use strict' 

var http = require('http');  
var url = require('url');
var util = require('util');
var fs = require('fs'); 
var path=require("path");
var querystring = require('querystring');
var express=require('express');
var serveIndex = require('serve-index');
var os = require( 'os' );

// get all local network interfaces
var ifs = os.networkInterfaces();
var host_ip = ifs['eth0'][0]['address'];
var host_port = 8080;
console.log("host ip is: " + host_ip);

var app = express();// 实例化

//app.use(serveIndex('./public')) // 预览目录
app.use(express.static(path.join(__dirname, 'public'))); // 发布静态目录的方法
//app.use(express.json())

// create http server based on app
var http_server=http.createServer(app);// 回调的时候，就会调用app，将参数传递给express，由express来处理

http_server.listen(host_port, host_ip); // port: 8080

// main function to execute power state change
function do_power_opt(chnl, opt) {

    var exec = require('child_process').exec;
    var py_file = './js_py_test.py';
   
    console.log("call python script to execute GPIO settings: ");
    console.log("channel: "+chnl+", operation: "+opt);
    var ret = exec('python '+py_file+' '+chnl+' '+opt, function(err, stdout, stdin){

        if(err){
            console.log('err: ' + err);
            console.log('Set power mode: ', opt, ' for channel: ' + chnl +' status:');
            console.log('channel', obj.chnl);
            console.log('option', obj.option);
            console.log('status', obj.status);

            return 1;
        }

        if(stdout)
        {
            //parse the string
            console.log(stdout);
            var astr = stdout.split('\r\n').join('');//delete the \r\n
            var obj = JSON.parse(astr);

            console.log('Set power mode: ', opt, ' for channel: ' + chnl +' status:');
            console.log('channel', obj.chnl);
            console.log('option', obj.option);
            console.log('status', obj.status);
        }

        return 0;
    });

    console.log("The result of python script is: " + ret);
    return 0;
}

app.get('/', function(req, res) {
    console.log("get a client request")
    res.sendFile(__dirname + "/public/smart_switch.html")
})


app.post('/public/power_on', function(req, res) {
    console.log("get a Power on request")
    var body = "";
    var board = "";

    req.on('data', function (chunk) {
	console.log("getting body data ... ")
        body += chunk;
    });

    req.on('end', function () {
         
        //body = querystring.parse(body);
	var data = JSON.parse(body);
	console.log("Request body: ");
	console.log("    channel:   " + data.channel);
	console.log("    operation: " + data.action);
	var chnl = data.channel;
        var opt = data.action;
        var err = do_power_opt(chnl, opt);
        // 设置响应头部信息及编码
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
    
        if(err) { 
            res.write("Execute power option: " + opt + ", fail!");
        } else { 
            res.write("Execute power option: " + opt + ", successfully!");
        }
        res.end();
    });

});

app.post('/public/power_off', function(req, res) {
    console.log("get a Power off request")
    var body = "";

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
	
	var data = JSON.parse(body);
        console.log("Request body: ");
        console.log("    channel:   " + data.channel);
        console.log("    operation: " + data.action);
        var chnl = data.channel;
        var opt = data.action;	
        var err = do_power_opt(chnl, opt);
        // 设置响应头部信息及编码
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});

        if(err) { 
            res.write("Execute power option: " + opt + ", fail!");
        } else {  // 输出结果
            res.write("Execute power option: " + opt + ", successfully!");
        }
        res.end();
    });

});

app.post('/public/power_reset', function(req, res) {
    console.log("get a Power reset request")
    var body = "";

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {
	
	var data = JSON.parse(body);
        console.log("Request body: ");
        console.log("    channel:   " + data.channel);
        console.log("    operation: " + data.action);
        var chnl = data.channel;
	
        var err = do_power_opt(chnl, "off");
        
        if(err) {
            res.write("Execute power option: off, fail!");
        } else {  // 输出结果
            err = do_power_opt(chnl, "on");
	    if (err) {
		res.write("Execute power option: on, failed!");
	    }
            res.write("Execute power option: " + opt + ", successfully!");
        }
	
	res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
        res.end();
    });

});
