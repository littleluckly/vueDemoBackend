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
var i = 7;

var firstUrl = `https://www.pengfu.com/index_${i}.html`;

function fetchPage(url){
    firstRequest(url)
}

function firstRequest(url){ 
    https.get(url, function(res){
        var html='';
        var titles=[];
        res.setEncoding('utf-8');
        res.on('data', function(chunk){
            html+=chunk;
        });
        res.on('end',function(){
            var $ =  cheerio.load(html);
            console.log($)
            $('.list-item').each(function(idx, item){
                var authorName = $(this).find('dd .user_name_list>a').text();
                var authorImgSrc = $(this).find('dt>a>img').attr('src');
                var laughTitle = $(this).find('dd h1>a').text();
                var laughImgSrc = $(this).find('.content-img img').attr('src');
                console.log('authorName,authorImgSrc,laughTitle,laughImgSrc',authorName,authorImgSrc,laughTitle,laughImgSrc)
                db.query(`INSERT INTO laugh (authorName, authorImgSrc, laughTitle, laughImgSrc) VALUES ( "${authorName}", "${authorImgSrc}", "${laughTitle}", "${laughImgSrc}" )`, function(result){
                    console.log('1',result)
                    i += 1;
                    if(i<49){
                        firstRequest(firstUrl)
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

function saveContent($,news_title){
    $('.article-content p').each(function (index, item) {
        var x = $(this).text();       

       var y = x.substring(0, 2).trim();

        if (y == '') {
            x = x + '\n';   
    //将新闻文本内容一段一段添加到/data文件夹下，并用新闻的标题来命名文件
            fs.appendFile('./data/' + news_title + '.txt', x, 'utf-8', function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    })
}

function saveImg($, news_title){
    $('.article-content img').each(function (index, item) { 
        var img_src = 'http://www.ss.pku.edu.cn' + $(this).attr('src'); //获取图片的url
        var img_filename = $(this).parent().next().text().trim();
        var extName = path.extname( $(this).attr('src'))
        request.head(img_src,function(err,res,body){
            if(err){
                console.log(err);
            }
        });
        request(img_src).pipe(fs.createWriteStream('./image/'+news_title + '---' + img_filename+extName))
    })
}
fetchPage(firstUrl)