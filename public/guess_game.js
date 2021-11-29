'use strict'  // 使用最严格的语法

var http = require('http');  // 引入http模块。相当于C++中的include头文件
var url = require('url');
var util = require('util');
var fs = require('fs'); // 引入fs模块
var path=require("path")

let randomNumber = Math.floor(Math.random() * 100) + 1;
const guesses = document.querySelector('.guesses');
const lastResult = document.querySelector('.lastResult');
const lowOrHi = document.querySelector('.lowOrHi');
const guessSubmit = document.querySelector('.guessSubmit');
const guessField = document.querySelector('.guessField');
let guessCount = 1;
let resetButton;

function generate_post(state) {

  lastResult.textContent = 'send a post request to server';
  var contents = "power on";

  var options = {
//  　　host: 'localhost:8080',
//  　　path: '/public/power_on',
　　method: 'POST',
　　headers: {
  　　'Content-Type': 'text/plain',
  　　'Content-Length': contents.length
　　}
  };

  var req = http.request(options, function(res){
    
    res.setEncoding('uft8');

    util.log('STATUS: ' + res.statusCode);
    util.log('HEADERS: ' + util.inspect(res.headers));
    lastResult.textContent = '设备上电成功！';

    res.on('data', function(chunk){
      util.log('BODY: ' + chunk);
    });

    res.on('error', function(err){
      util.log('RESPONSE ERROR: ' + err);
    });

  });

  req.on('error', function(err){
    util.log('REQUEST ERROR: ' + err);
  });

  req.write(contents);
  req.end(); //不能漏掉，结束请求，否则服务器将不会收到信息。

}

function checkGuess() {
  let userGuess = Number(guessField.value);
  if (guessCount === 1) {
    guesses.textContent = '上次猜的数：';
  }

  guesses.textContent += userGuess + ' ';

  if (userGuess === randomNumber) {
    lastResult.textContent = '恭喜你！猜对了！';
    lastResult.style.backgroundColor = 'green';
    lowOrHi.textContent = '';
    setGameOver();
  } else if (guessCount === 10) {
    lastResult.textContent = '!!!游戏结束!!!';
    lowOrHi.textContent = '';
    setGameOver();
  } else {
    lastResult.textContent = '你猜错了！';
    lastResult.style.backgroundColor = 'red';
    if(userGuess < randomNumber) {
      lowOrHi.textContent = '你刚才猜低了！' ;
    } else if(userGuess > randomNumber) {
      lowOrHi.textContent = '你刚才猜高了！';
    }
  }

  guessCount++;
  guessField.value = '';
  guessField.focus();
}

guessSubmit.addEventListener('click', generate_post);

function setGameOver() {
  guessField.disabled = true;
  guessSubmit.disabled = true;
  resetButton = document.createElement('button');
  resetButton.textContent = '开始新游戏';
  document.body.appendChild(resetButton);
  resetButton.addEventListener('click', resetGame);
}

function resetGame() {
  guessCount = 1;
  const resetParas = document.querySelectorAll('.resultParas p');
  for(let i = 0 ; i < resetParas.length ; i++) {
    resetParas[i].textContent = '';
  }

  resetButton.parentNode.removeChild(resetButton);
  guessField.disabled = false;
  guessSubmit.disabled = false;
  guessField.value = '';
  guessField.focus();
  lastResult.style.backgroundColor = 'white';
  randomNumber = Math.floor(Math.random() * 100) + 1;
}