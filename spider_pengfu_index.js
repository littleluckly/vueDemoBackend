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

var firstUrl = `https://www.pengfu.com/index_${i}.html`;

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
            var len = $('.list-item').length-1;
            $('.list-item').each(function(idx, item){
                var type='',laughImgSrc='',laughText='';
                var authorName = $(this).find('dd .user_name_list>a').text(); 
                var authorImgSrc = $(this).find('dt>a>img').attr('src');
                var laughTitle = $(this).find('dd h1>a').text();
                if( $(this).find('.content-img img').length>0){
                    laughImgSrc = $(this).find('.content-img img').attr('src');
                    type = 'img'
                }else{
                    type = 'text'; 
                    laughText = $(this).find('.content-img').text().trim()
                }   
                db.query(`INSERT INTO laugh (authorName, authorImgSrc, laughTitle, laughImgSrc, laughText, type) VALUES ( "${authorName}", "${authorImgSrc}", "${laughTitle}", "${laughImgSrc}", "${laughText}", "${type}" )`, function(result){ 
                    if( (idx >= len) && i<15 ){ 
                        i += 1;
                        console.log(`idx-${idx},,,,,len-${len},,,,,,i-${i},,,,,https://www.pengfu.com/index_${i}.html`) 
                        firstRequest(`https://www.pengfu.com/index_${i}.html`)
                    } 
                })  
            })  
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