var express = require("express");
var logfmt = require("logfmt");
var news = require("./api/news");
var path = require("path");
var app = express();

app.use(logfmt.requestLogger());
app.use(express.static(path.join(__dirname, 'public')));

var router = express.Router();

router.get('/', function(req, res) {
    res.render('./public/index.html');
});

router.get('/api/newsdata', function(req, res) {
    news.getData(req.query, function(d){
        res.json(d);
    });
});

router.get('/api/newsstories', function(req, res){
    news.getNews(req.query, function(d){
        res.json(d);
    });
});

app.use('/', router);

var port = Number(process.env.PORT || 5000);  

app.listen(port, function() {
    console.log("Listenting on " + port);
});
