/**
 * 捧腹网首页数据爬虫
 */
var fs = require('fs');
// var https = require('https');
var http = require('http');
var request = require('request');
// var request = require('superagent');
var cheerio = require('cheerio');
var path = require('path')
// require('superagent-proxy')(request);
var express = require('express');
var router = express.Router();
var db = require('./utils/db.js');
var i = 6;

var firstUrl = `http://localhost:3000/v1/fm`;

function fetchPage(url){
    firstRequest(url)
}

function firstRequest(url){
    http.get({
		hostname: 'music.163.com',
		method: 'GET',
		path: url,
		headers: {
			'Accept': '*/*',
			'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
			'Connection': 'keep-alive',
			'Content-Type': 'application/x-www-form-urlencoded',
			'Referer': 'http://music.163.com',
			'Host': 'music.163.com',
			// 'Cookie': cookie,
			'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/602.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/602.1'
        },
	}, function(res){
        var html='';
        res.setEncoding('utf-8');
        res.on('data', function(chunk){
            html+=chunk;
        });
        res.on('end',function(){
            console.log(html)
        })
    })



    // request.get(firstUrl).proxy('http://101.132.122.230:3128').end(function(err,res){
    //     if(err){
    //         console.log(err)
    //     }else{
    //         console.log(res.status,res.text.substring(0,20))
    //         var html=res.text;
    //         var titles=[];
    //         var $ =  cheerio.load(html);
    //             var news_title = $('div.article-title a').text().trim();
    //             saveContent($,news_title)
    //             saveImg($,news_title)
    //             console.log('news_title',news_title)
    //         }

    // })
}
fetchPage(firstUrl)