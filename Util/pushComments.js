
var movieModel = require('../models/movie').movieModel
var cognitoUpdateRecordFunc = require('./cognitoIdentity').cognitoUpdateRecordFunc;

exports.pushCommentFunc = function(req, res, next) {
    var cognitoId = req.session.cognitoId;
    console.log("In ajax cognitoId "+cognitoId);
    var poolId = require('./config').cognito.identityPoolId;
    var username = req.session.name;
    console.log("username is "+username);
    var comment = req.body.comment;
    var movieId = req.body.movieId;
    cognitoUpdateRecordFunc(req,res,next,movieId,'replace',comment);
    res.send({"comment":comment});
    movieModel.update({ "_id":movieId},
        {$pull: {
            'comments': {"_id": cognitoId}
        }},
        function (err, movie){
            console.log("pulling comments");
            movieModel.update({ "_id":movieId},
                {$push: {
                    'comments': {
                        "_id": cognitoId,
                        "body":comment,
                        "username":username,
                    }
                }},
                function (err, movie){
                    console.log("pushing comments");
                });
        });
}

