
movieModel = require("../models/movie").movieModel;

exports.loadCommentFunc = function(thisMovie){

    function callBack (req,res,next) {
        commArr = [];
        var renderHtml = function renderHtml() {
            res.render('eachIMDB250', {
                thisMovie:thisMovie, comments: commArr,sessionVal:req.session
            });
        }
        var queryDBAndRender = function (renderHtml) {
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
                            })
                        }
                        renderHtml();
                    }
                });
        }
        queryDBAndRender(renderHtml);
    }
    return callBack;
}