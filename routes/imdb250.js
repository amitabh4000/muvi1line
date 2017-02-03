
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ type: 'application/*+json'});
var movieObj = require('../imdb250.json');
var AWS = require('aws-sdk');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');

var movieModel = require('../models/movie').movieModel
var loadCommentFunc = require('../Util/loadComments').loadCommentFunc;
var pushCommentCallback = require('../Util/pushComments').pushCommentFunc;
var config = require('./../Util/config');
var cognitoIdentity = require('../Util/cognitoIdentity');
var changeEdit = require('../Util/changeEditVar').changeEdit;
movieArr = movieObj.data;
routeArr =[];

for(var i = 0 ; i < movieArr.length; i++){
    routeArr.push( '/title/' + movieArr[i].id );
}
var router = express.Router();
url = "IMDB250/title";
sendObj = {url:url, movieArr:movieArr};


router.get('/', function(req, res, next) {
    console.log("In /IMDB250")
    sendObj.sessionVal = req.session;
    console.log("SessionVal sent to browser is" +sendObj.sessionVal);
    res.render('imdb250View' , sendObj);
});

movieArr.forEach(function (thisMovie) {
    var loadCommentCallback = loadCommentFunc(thisMovie);
    router.get(thisMovie.regex, loadCommentCallback);
    var ajaxPost = thisMovie.regex+'/ajax';
    router.post(ajaxPost,jsonParser, pushCommentCallback);
    var ajaxEditPost = thisMovie.regex+'/ajaxEdit';
    router.post(ajaxPost,changeEdit);
})
module.exports = router;
