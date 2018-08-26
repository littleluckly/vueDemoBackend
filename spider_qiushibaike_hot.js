/**
 * 糗事百科热门爬虫,  TODO: 有反爬虫机制，爬不了数据。。。。。。。。cry!
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
var i = 1;

var firstUrl = `https://www.qiushibaike.com/8hr/page/${i}/`;

function fetchPage(url){
    firstRequest(url)
}

function firstRequest(url){ 
    // var authorName = 'authorName';
    // var authorImgSrc = 'authorImgSrc';
    // var laughTitle = 'laughTitle';
    // var laughImgSrc = '';
    // var laughText = '    前天， 乡下的大表叔给我打来电话，说是中秋快到了，给我寄了礼物。我很开心，被家人惦记的感 觉真好。今天我接到快递，拆开一看是两盒廉价包装的月饼，仔细又看了一下，卧槽！这不是我去年给他的吗？';
    // var type = 'text';
    // db.query(`INSERT INTO laugh (authorName, authorImgSrc, laughTitle, laughImgSrc, laughText, type) VALUES ( "${authorName}", "${authorImgSrc}", "${laughTitle}", "${laughImgSrc}", "${laughText}", "${type}" )`, function(result){
    //     console.log('1',result) 
    // }) 

    const options = {
        "url": `https://www.qiushibaike.com/8hr/page/${i}/`, 
        // path: '/',
        // "hostname": 'https://www.qiushibaike.com', 
        "Upgrade-Insecure-Requests" : "1",
        "port": 5568,
        "method": 'GET',
        headers: {
            'User-Agent':'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36'
        }
      };  
    https.get(options, function(res){
        var html=''; 
        res.setEncoding('utf-8');
        res.on('data', function(chunk){
            html+=chunk;
            console.log('chunk',chunk)
        });
        req.on('error', (e) => {
            console.error('error',e);
        });
        res.on('end',function(){
            var $ =  cheerio.load(html);  
            $('.article.block').each(function(idx, item){ 
                var authorName = $(this).find('.author a').eq(1).text().trim()
                var authorImgSrc = $(this).find('.author a').eq(0).find('img').attr('src');
                var content = $(this).find('.content span').text().trim()
                var contentImgSrc = $(this).find('.thumb a>img').length>0?$(this).find('.thumb a>img').attr('src'):'';
                db.query(`INSERT INTO qiushibaikehot (authorName, authorImgSrc, content, contentImgSrc) VALUES ( "${authorName}", "${authorImgSrc}", "${content}", "${contentImgSrc}" )`, function(result){ 
                    if(i<2){
                        i += 1;
                        firstRequest(`https://www.qiushibaike.com/8hr/page/${i}/`)
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