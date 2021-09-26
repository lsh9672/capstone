var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    if (_url == '/' || _url == '/ocr.html') {
        _url = '/ocr.html';
    }
    if (_url == '/custom'){
        // 템플릿 목록 불러오기
    }
    if (_url == '/templateList'){
        // 템플릿 목록 불러오기
    }
    if (_url == '/templateEdit'){
        // 해당 템플릿 정보 불러오기
    }
    if (_url == '/favicon.ico') {
        return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname + _url));
});
app.listen(3000);

// var express = require('express');
// var app = express();
// var PORT = 3000;

// app.get("/", (req, res) => {

// });
// app.get('/', function(req, res) {
//     res.render('ocr.html');
// });
// app.listen(PORT, () => {

// });