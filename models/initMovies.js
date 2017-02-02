
var movies = require('../imdb250.json');
var movieModel = require('./movie.js').movieModel;

movies.data.forEach(function(movie){
    var eachMovie = new movieModel();
    eachMovie._id = movie.id;
    eachMovie.title = movie.title;
    eachMovie.save(function (err) {
        if(err) {
            console.log("error :"+err.body);
        }
    })
});