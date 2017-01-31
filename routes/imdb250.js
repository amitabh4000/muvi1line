
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
movieArr = movieObj.data;
routeArr =[];

var COGNITO_DATASET_NAME = "USER_INFO_COMMENTS";
var COGNITO_SYNC_TOKEN;
var COGNITO_SYNC_COUNT;

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
    router.post('/ajax',jsonParser, pushCommentCallback);
})
module.exports = router;