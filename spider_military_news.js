/**
 * 捧腹网首页数据爬虫
 */
var fs = require('fs');
var https = require('https');
var request = require('request');
// var request = require('superagent');
var cheerio = require('cheerio');
var path = require('path')
// require('superagent-proxy')(request);
var express = require('express');
var router = express.Router();
var db = require('./utils/db.js');
var i = 6;

// https://news.baidu.com/mil
var firstUrl = `https://news.baidu.com/mil`;

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
            $('#instant-news li').each( function(idx, item){
                var src = $(this).find('a').attr('href')
                var title = $(this).find('a').text() 
                db.query(`INSERT INTO militaryNews (newsTitle, newsSrc) VALUES ("${title}", "${src}")`,(result)=>{

                })
            })
        })

    }) 
} 
fetchPage(firstUrl)