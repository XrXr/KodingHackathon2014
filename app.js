var express = require("express");
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

var router = express.Router();

router.get('/', function(req, res) {
    res.json(
        {message: "root"}
    );
});

router.get('/:param', function(req, res) {
    res.json({
        message: req.params.param
    });
});

route.get('/api/newsdata', function(req, res) {
    res.json({
        message: "not yet implemented", 
        feature: "returns a dataset about the news"
    });
});

route.get('/api/newsstories', function(req, res){
     res.json({
        message: "not yet implemented", 
        feature: "returns the actual news stories"
    });
});
   

app.use('/', router);

var port = Number(process.env.PORT || 5000);  

app.listen(port, function() {
    console.log("Listenting on " + port);
});
