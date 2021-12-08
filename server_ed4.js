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

function do_gpio_init() {

    var exec = require('child_process').exec;
    var py_file = './gpio_init.py';

    console.log("Request data: ");
    var ret = exec('python '+py_file, function(err, stdout, stdin){

        if(err){
            console.log('err: ' + err);
            return 1;
        }

        if(stdout)
        {
            //parse the string
            console.log(stdout);
            var result_str = stdout.split('\r\n').join('');//delete the \r\n
            var result = JSON.parse(result_str);

            console.log('Execute status: ');
            console.log('       status: ', result.status);
        }

        return 0;
    });

    return 0;

}

// first init related gpio pins to power on state
// the default relay mode is effective in gpio.LOW
do_gpio_init()

// main function to execute power state change
function do_post_request(post_data) {

    var exec = require('child_process').exec;
    var py_file = './js_py_test.py';
    var data = post_data;

    var board = data.board;
    var chnl = data.channel;
    var opt = data.action;

    console.log("Request data: ");
    console.log("    board:   " + data.board);
    console.log("    channel:   " + data.channel);
    console.log("    operation: " + data.action);
    var ret = exec('python '+py_file+' '+board+' '+chnl+' '+opt, function(err, stdout, stdin){

        if(err){
            console.log('err: ' + err);
	    console.log('Execute info: ');
            console.log('	board: ', board);
            console.log('	channel: ', chnl);
            console.log('	option: ', opt);

            return 1;
        }

        if(stdout)
        {
            //parse the string
            console.log(stdout);
            var result_str = stdout.split('\r\n').join('');//delete the \r\n
            var result = JSON.parse(result_str);

            console.log('Execute status: ');
            console.log('       board: ', result.board);
            console.log('       channel: ', result.chnl);
            console.log('       option: ', result.option);
            console.log('       status: ', result.status);
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
         
	var data = JSON.parse(body);
        var err = do_post_request(data);
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
    
        if(err) {
            res.write("Execute post request fail!");
        } else { 
            res.write("Execute post request successfully!");
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
        var err = do_post_request(data); 
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
	
        if(err) {
            res.write("Execute post request fail!");
        } else { 
            res.write("Execute post request successfully!");
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
        var err = do_post_request(data);
	res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});

        if(err) {
            res.write("Execute post request fail!");
        } else { 
            res.write("Execute post request successfully!");
        }
	
        res.end();
    });

});
