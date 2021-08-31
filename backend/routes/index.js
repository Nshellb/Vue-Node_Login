var express = require('express');
var router = express.Router();
var path = require('path'); // 모듈 추가

/* GET home page. */
router.get('/', function(req, res, next) {

  res.sendfile(path.join(__dirname, '../public/index.html')); // Vue로 빌드된 html 전송

  // res.render('index', { title: 'Express' });
});

module.exports = router;
