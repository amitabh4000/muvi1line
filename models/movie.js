var mongoose = require('mongoose');
var connection = require('../app').connection;
var movieSchema = mongoose.Schema({
    _id:String,
    movieId :String,
    title: String,
    comments: [{_id:String, username:String,
                 body:String, likes:Number,
                 time:String,currTime:String,
                  dateInSimpleFormat: String}],
    likes: Number
});

exports.movieModel = mongoose.model('movieModel', movieSchema);
