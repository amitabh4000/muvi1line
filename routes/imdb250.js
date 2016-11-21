
var express = require('express');
var bodyParser = require('body-parser');
var movieObj = require('../imdb250.json');
var AWS = require('aws-sdk');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var movieModel = require('../models/movie')

var jsonParser = bodyParser.json({ type: 'application/*+json'});
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
sendObj = {url:url ,movieArr:movieArr };



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('imdb250View' , sendObj);
});

movieArr.forEach(function (thisMovie) {

    router.get(thisMovie.regex, function(req, res, next) {


        commArr = [];
        // var commentPromise = new Promise( function (resolve,reject) {
        //     var returnDB = queryDB();
        // })

        renderHtml = function renderHtml() {
            res.render('eachIMDB250', {
                title: thisMovie.title, backdrop: thisMovie.backdropPath,
                year: thisMovie.year, rating: thisMovie.rating
                , movieId: thisMovie.id, comments: commArr
            });
        }
        queryDBAndRender = function(callBack) {
            movieModel.findOne({"_id": thisMovie.id},
                function (err, movie) {
                    if (err) {
                        console.log("error finding movie");
                    }
                    else {
                        if (movie.comments != null && movie.comments.length > 0) {
                            console.log("into not null comments");
                            movie.comments.forEach(function (comment) {
                                commArr.push(comment);
                                console.log("comment from DB: " + movie);
                                console.log("comment from variable: " + commArr[0].body);
                            })
                        }
                        callBack();
                    }
                });
        }
        queryDBAndRender(renderHtml);





    });

    router.post('/ajax',jsonParser, function(req, res){
        var cognitoId = require('./index').cognitoId;
        var poolId = require('./index').poolId;
        var username = require('./index').userName;
        var comment = req.body.comment;
        var movieId = req.body.movieId;
        console.log("cognito id is: "+cognitoId)
        console.log("name is: "+username);
        updateRecords(cognitoId , poolId,comment,movieId);
        console.log(comment);
        res.send({"comment":comment});
        movieModel.update({ "_id":movieId},
            {$pull: {
                'comments': {"_id": cognitoId}
            }},
            function (err, movie){

            });

        movieModel.update({ "_id":movieId},
            {$push: {
                'comments': {
                    "_id": cognitoId,
                    "body":comment,
                    "username":username,
                    "likes": 3,
                }
            }},
            function (err, movie){

            });


            });
        })
function updateRecords(cognitoId,poolId,comment,movieId){
    cognitosync = new AWS.CognitoSync();
    cognitosync.listRecords({
        DatasetName: COGNITO_DATASET_NAME,
        IdentityId: cognitoId,
        IdentityPoolId:poolId
    },function(err , data){
        if(err) console.log("listRecords: ".red +err ,err.stack);
        else{
            console.log("listRecords".green + JSON.stringify(data));
            COGNITO_SYNC_TOKEN = data.SyncSessionToken;
            COGNITO_SYNC_COUNT = data.DatasetSyncCount;
            console.log("Sync Session token ".green + COGNITO_SYNC_TOKEN);
            console.log("Sync Session count ".green + COGNITO_SYNC_COUNT);

            var params = {
                DatasetName: COGNITO_DATASET_NAME,
                IdentityId: cognitoId,
                IdentityPoolId: poolId,
                SyncSessionToken: COGNITO_SYNC_TOKEN,
                RecordPatches:[
                    {
                        Key: movieId,
                        Op: 'replace',
                        SyncCount: COGNITO_SYNC_COUNT,
                        Value:comment
                    }
                ]
            };
            //console.log("UserID ".cyan + FACEBOOK_USER.id);
            cognitosync.updateRecords(params , function(err , data){
                if(err) console.log("updateRecord".red + err , err.stack);
                else console.log("Value ".green + JSON.stringify(data));
            });
        }
    })
}

module.exports = router;
