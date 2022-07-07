const express = require('express');
const https = require('https');
const bodyparser = require('body-parser');
const { request } = require('http');
require('dotenv').config();


const app = express();
app.use(express.static(__dirname + '/public'));

app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.get("/",function(req,res){   
  
    function getNews(key,type,callback){

        const userAgent = req.get('user-agent');
        const option = {
        host: 'newsapi.org',
        path: '/v2/top-headlines?category=' +type+ '&country=in&apiKey='+key,
            headers:{
                'User-Agent': req.get('user-agent')
            }
        }

        var data = "";
        const request=  https.get(option,response=>{
                console.log(response.statusCode);
                
                response.on("data",chunk=>{       
                    data+=chunk;
                });


            response.on("end",function(){
                let temp = JSON.parse(data);
                var arr = [];    
                for(var j=0;j<25;j++){
                        if(temp.articles[j])
                        arr.push(temp.articles[j]);
                        
                } 

                callback(arr)
            });
        });
            
        request.on('error',function(e){
            console.log(e)
        });
        request.end();
    }
    
    var key1 = process.env.API_KEY1;
    var key2 = process.env.API_KEY2
    var key3 = process.env.API_KEY3;
    var key4 = process.env.API_KEY4;
    var key5 = process.env.API_KEY5;
    var key6 = process.env.API_KEY6;



    var categories = ['','technology','sports','business','science','health','entertainment'];
    getNews(key1,categories[0],function(topNews){
    getNews(key2,categories[1],function(technology){
    getNews(key3,categories[2],function(sports){
    getNews(key4,categories[3],function(business){
    getNews(key5,categories[4],function(science){
    getNews(key6,categories[5],function(health){
        getNews(key6,categories[6],function(entertainment){
            console.log(topNews[0].title);
            res.render('main',{data1:topNews, data2:technology, data3:sports ,data4:business,
                                data5:science,   data6:health,      data7:entertainment});
                
                var arr = [topNews,technology,sports,business,science,health,entertainment];
                var arr_title = ['Top News','Technology','Sports','Business','Science','Health','Entertainment'];


                app.get('/:type',function(req,res){
                    var temp = req.params.type;
                    res.render("news",{title:arr_title[temp],data1:arr[temp]});
                });               
                                
        });
    });                    
    });
    });
    });    
    });
    });

    /*------------------Search Request------------------------------------------*/
    app.post("/search",function(request,response){
        console.log(request.body);
            
           if(request.body.input === ""){
              response.redirect("/");
              request.end();
           }

           var str =request.body.input;
           var replaced = '"'+str.split(' ').join('%20')+'"';
           console.log(replaced);   
      
            var key = process.env.API_KEY6;       
            const userAgent = req.get('user-agent');
            const options = {
            host: 'newsapi.org',
            path: 'https://newsapi.org/v2/everything?q='+replaced+'&apiKey='+key,
                headers:{
                    'User-Agent': req.get('user-agent')
                }
                
            }

            var datas = "";
            https.get(options,responses=>{
                console.log(responses.statusCode);
                
                responses.on("data",chunk=>{       
                    datas+=chunk;
                });


                responses.on("end",function(){
                    let temp = JSON.parse(datas);
                    var arrs = [];    
                    for(var j=0;j<30;j++){
                        if(temp.articles[j] === undefined){
                        }else{
                            arrs.push(temp.articles[j]);
                        }
                            
                    }

                    //console.log(arrs);
                    if(arrs[0] === undefined){
                        console.log('stop');
                        response.render('failure');
                    }else{ 
                        response.render('search',{searchtitle:request.body.input, datasearch:arrs});
                    }
                    
                });
            });

    });
});



app.listen(3000 || process.env.PORT,function(){
    console.log("server is running");
});