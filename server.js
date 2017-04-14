/* eslint-disable */
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');

var app = new (require('express'))();
var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
});

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info('server has started on port ',port)
  }
});



// 数据接口
var request = require('request');
var pageSize = 1;
var options = {
  url:"http://react-china.org/latest?no_definitions=true&page="+pageSize+"&_=1492065010030",
  headers: {
    "Accept":"application/json, text/javascript, */*; q=0.01",
	"Accept-Encoding":"gzip, deflate, sdch",
	"Accept-Language":"zh-CN,zh;q=0.8",
	"Connection":"keep-alive",
	"Cookie":"__utmt=1; _forum_session=WWdZQTQra2FiWTl4RndWSWNtMkp1UTYzdHIvMGtGQ0NhWXBDQkNoZkplQXpqeHZQcmd1QXBjcEoyY201SUFIdDY4NHFSSWlwOUZTTWthYUhqRk0xcFE9PS0tZlE0cm5EdE9yd280c0dtU2hTV2g3Zz09--95d83fb4504573db12bdbf04715da77b4a4a324d; _ga=GA1.2.837246515.1491988548; __utma=93274398.837246515.1491988548.1492054092.1492064864.4; __utmb=93274398.4.10.1492064864; __utmc=93274398; __utmz=93274398.1492054092.3.3.utmcsr=baidu|utmccn=(organic)|utmcmd=organic",
	"Discourse-Track-View":true,
	"Host":"react-china.org",
	"Referer":"http://react-china.org/latest?no_definitions=true&page=1&_=14",
	"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
	"X-CSRF-Token":"undefined",
	"X-Requested-With":"XMLHttpRequest"
  }
};


app.get('/api/data/:pageSize',function(req,res){
	pageSize = req.params.pageSize;
	options.url ="http://react-china.org/latest?no_definitions=true&page="+pageSize+"&_=1492065010030";
	request.get(options,function(error, response, body) {
		if(error){
			console.log(error);
		}
		if (!error && response.statusCode == 200) {
			pageSize++;
			res.setHeader("Content-Type","application/json;charset=utf-8");
		    res.end(body);
		}
	})
})


var num = 0;

app.get('/api/test',function(req,res){
	res.write(num.toString());
	num++;
	res.end();
})