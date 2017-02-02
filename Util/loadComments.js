
movieModel = require("../models/movie").movieModel;

exports.loadCommentFunc = function(thisMovie){

    function callBack (req,res,next) {
        var thisComm = {};
        var commArr = [];
        var isEdit = req.session.isEdit;
        var timeElapsed = [];
        var renderHtml = function renderHtml() {
            res.render('eachIMDB250', {
                thisMovie:thisMovie,
                thisComment: thisComm ,
                comments: commArr,
                sessionVal:req.session,
                isEdit:isEdit
            });
            console.log(req.session.isEdit)
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
                                comment.currTime = require('./timeSimpleFormat').timeSimpleFormat(comment);
                                if(comment._id == req.session.cognitoId && comment._id != undefined){
                                    console.log("Inside same id");
                                    console.log("cognitoID"+req.session.cognitoId);
                                    thisComm = comment;
                                    console.log(thisComm.body);
                                }
                                var eachTimeMap = {};
                                timeElapsed.push(eachTimeMap)
                                console.log("thisComment: "+Object.keys(thisComm).length);
                                commArr.push(comment);
                            })
                        }
                        renderHtml();
                        setTimeout(function(){req.session.isEdit = false;},1000);
                    }
                });
        }
        queryDBAndRender(renderHtml);
    }
    return callBack;
}