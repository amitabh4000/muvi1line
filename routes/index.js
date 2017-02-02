var express = require('express');
var imdb250 = require('./imdb250');
var session = require('express-session');
var bodyParser = require('body-parser');
var passportRouter = require('./passport').router;


var router = express.Router();
var beforeLoginPage = "/IMDB250/";
var USER_NAME;
var jsonParser = bodyParser.json({ type: 'application/*+json'});


router.use(passportRouter);
router.use(session({
    secret: 'defaultsecret',
    resave: true,
    saveUninitialized: true,
    store:require('../app').connection,
}));

router.use('/' , imdb250);
router.use('/IMDB250' , imdb250);
router.post('/ajaxLogin',jsonParser, function(req, res,next) {
    req.session.localToken = req.body.val;
    USER_NAME = req.body.name.split(" ")[0];
    req.session.name = USER_NAME;
    console.log("inside ajax call "+USER_NAME);
    require('../Util/cognitoIdentity').cognitoGetIdFunc(req,res,next);
});

router.get('/logout',function(req,res){
    req.session.beforeLoginPage = req.headers.referer;
    delete req.session.name;
    delete req.session.cognitoId;
    res.redirect(req.session.beforeLoginPage ? req.session.beforeLoginPage : '/IMDB250');
});

router.get('/login',function(req,res,next){
    //console.log(req.session);
    if(req.headers.referer)
    req.session.beforeLoginPage = req.headers.referer;
    console.log("Last page was"+beforeLoginPage);
    res.render('login');
});


exports.router = router;
exports.beforeLoginPage = beforeLoginPage;