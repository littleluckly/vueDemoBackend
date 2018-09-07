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

var firstUrl = `http://kengdie.com/category/lgg/`;

function fetchPage(url){
    firstRequest(url)
}

function firstRequest(url){
    const opt = {
        cookie: 'UM_distinctid=165a3fca8e4f78-0f0517a9617286-9393265-1fa400-165a3fca8e572d; CNZZDATA3119987=cnzz_eid%3D1342487385-1536053466-https%253A%252F%252Fwww.baidu.com%252F%26ntime%3D1536053466; Hm_lvt_04a2f9e535ccd993cb6a15ea056be0aa=1536054569; Hm_lpvt_04a2f9e535ccd993cb6a15ea056be0aa=1536054569',
        url: firstUrl,
        'referer': 'https://www.baidu.com/link?url=iHbX1b5xRnYFW5n-lZdM9eGxZZ-IgM5CbFL0h1YURwPmCx37XGHjoVqUWbPSVIY9&wd=&eqid=8575eb81000195da000000065b8e548f',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
    }
    http.get(opt, function(res){
        var html='';
        res.setEncoding('utf-8');
        res.on('data', function(chunk){
            html+=chunk;
        });
        res.on('end',function(){
            var $ =  cheerio.load(html);
            console.log($('.tag-tna').length)
            $('.tag-tna').each( function(idx, item){
                console.log($(this).find('img').attr('src'))

            })
        })

    })
}
fetchPage(firstUrl)