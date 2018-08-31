/**
 * 捧腹网首页数据爬虫
 */
var fs = require('fs');
var https = require('https');
// var request = require('request');
// var request = require('superagent');
var cheerio = require('cheerio');
var path = require('path')
// require('superagent-proxy')(request);
var express = require('express');
// var router = express.Router();
var db = require('./utils/db.js');
var i = 6;

// https://news.baidu.com/mil
var firstUrl = `https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=%E5%89%8D%E7%AB%AF%E6%96%B0%E6%8A%80%E6%9C%AF&oq=%25E5%2589%258D%25E7%25AB%25AF%25E6%2596%25B0%25E6%258A%2580%25E6%259C%25AF&rsv_pq=ba9150f000008302&rsv_t=669a4YIJFdtUSHokbCNoe0fpml233IMIgRgHcC0A5g7Cv0Y5bVZhqkfCRjM&rqlang=cn&rsv_enter=0`;

function fetchPage(url){
    firstRequest(url)
}

function firstRequest(url){
    https.get(url, function(res){
        var html='';
        res.setEncoding('utf-8');
        res.on('data', function(chunk){
            html+=chunk;
        });
        res.on('end',function(){
            var $ =  cheerio.load(html);
            $('.result.c-container h3').each( function(idx, item){
                var src = $(this).find('a').attr('href')
                var title = $(this).find('a').text().replace(/<em>|<\/em>/gm, '');
                console.log( $(this).find('a').text())
                db.query(`INSERT INTO hotNews (newsTitle, newsSrc) VALUES ("${title}", "${src}")`,(result)=>{
                }).on('error', (e) => {
                    console.error('error------',e);
                })
            })
        })

    })
}
fetchPage(firstUrl)