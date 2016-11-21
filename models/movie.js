

var mongoose = require('mongoose');
var movies = require('../imdb250.json');
var connection = require('../app').connection;
var movieSchema = mongoose.Schema({
    _id:String,
    movieId :String,
    title: String,
    comments: [{_id:String, username:String, body:String, likes:Number, date:Date }],
    likes: Number
});

 var movieModel = mongoose.model('movieModel', movieSchema);

movies.data.forEach(function(movie){

    var eachMovie = new movieModel();
    eachMovie._id = movie.id;
    eachMovie.title = movie.title;
    //console.log("movie inserted: "+eachMovie.title);
    eachMovie.save(function (err) {
        if(err) {
            //console.log("error :"+err.body);
        }
        else{
            //console.log('movie is being written');
        }
    })
});


// movieModel.findOne({ title: 'The Godfather' }, function (err, movie){
//     if(err) {
//         console.log("error occured");
//
//     }
//     else{
//         movie.comments.push({_id:1,username:"Amitabh",body:"for godfather",likes: 5});
//         movie.save();
//     }
// })
module.exports = movieModel;