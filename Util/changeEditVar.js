
var movieModel = require('../models/movie').movieModel

exports.changeEdit = function(req,res){
    console.log("In ajaxEdit");
    req.session.isEdit = true;
    res.send({"comment":"lol"});
    var movieId = req.body.movieId;
    var comment = req.body.comment;
    movieModel.update({ "_id":movieId},
        {$pull: {
            'comments': {"_id": cognitoId}
        }},
        function (err, movie){
            if(err) console.log("No previous comments");
            else console.log("pulling comments");
            movieModel.update({ "_id":movieId},
                {
                    $push: {
                        'comments': {
                            "_id": cognitoId,
                            "body":comment,
                            "username":username,
                            "time": Date.now()
                        }
                    }
                },
                function (err, movie){
                    console.log("pushing comments");
                    console.log(movieId);
                });
        });
};