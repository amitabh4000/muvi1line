/**
 * Created by SAmitabh on 11-08-2016.
 */

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var tmdb = require('moviedb')('21cdf422c9fc476484967a1b1ffedeb7');


const IMAGE_BASE_PATH = "http://image.tmdb.org/t/p/w300/";
const BACKDROP_BASE_PATH = "http://image.tmdb.org/t/p/w780/";
const REGEX_BASE = '/title/';


url = "http://www.imdb.com/chart/top";

request(url , function(error , response , html){
    // tmdb.searchMovie({query: 'the godfather' }, function(err, res){
    //     console.log(res);
    // });
    var idArray =[];
    var titleArray =[];
    var yearArray =[];
    var ratingArray =[];

    var arrayObject = [];   /// To hold the movie information
    arrTempStore = [];   /// To store the poster paths temporarily and then add to
    countLoop = 0;
    step = 0;   //// Counter to show on console that process is ongoing ///
    fileReady = false;


    if( ! error){
        var $ = cheerio.load(html);

        $('.titleColumn' ).each(function(){
            var data = $(this);
            var c = data.children();
            //console.log(c.first().text());
            titleArray.push(c.first().text());
        });
        $('.titleColumn .secondaryInfo' ).each(function(){
            var data = $(this);
            var length = data.text().length;
            var yearRelease = data.text().substring(1 , length -1);
            //console.log(yearRelease);
            yearArray.push(yearRelease);
        });
        $('.ratingColumn.imdbRating').each(function(){
            var data = $(this);
            //console.log(data.children().first().attr("title"));
            ratingArray.push(data.children().first().text());
        });

        $('.ratingColumn .seen-widget').each(function(){
            var data = $(this);
            idArray.push(data.attr("data-titleid"));
        });
    }





    for(var i = 0 ; i < ratingArray.length ; i++){
        var movieObject = {id:"",title:"", year:"", rating:"",posterPath:"",backdropPath:"",regex:""};
        movieObject.id = idArray[i];
        movieObject.title  = titleArray[i];
        movieObject.year  = yearArray[i];
        movieObject.rating  = ratingArray[i];
        movieObject.regex = REGEX_BASE + idArray[i];
        arrayObject.push(movieObject);
    }
    jsonObject = {name:"movieData" , data:arrayObject};


    var timeInterval = setInterval(function () {
        console.log("Adding posterPath ongoing, Step: " +(++step));
            tmdb.searchMovie({query: titleArray[countLoop]}, function (err, res) {
                        arrTempStore.push(res);
                        //console.log(res);
            });


            countLoop++;
            console.log("count is: "+countLoop+" size is: "+arrTempStore.length);
        if(countLoop >= titleArray.length ){
            setTimeout(writeJSON,1000);
            clearInterval(timeInterval);
        }
    },2000);


    function writeJSON(){
        console.log(arrTempStore.length);
        for(var i=0; i<arrTempStore.length ;i++){
            for( var j = 0 ; j < arrTempStore[i].results.length ; j++) {
                if(arrTempStore[i].results[j].release_date.substring(0 , 4) == yearArray[i]) {
                    console.log(arrTempStore[i].results[j].title);
                    jsonObject.data[i].posterPath = IMAGE_BASE_PATH + arrTempStore[i].results[j].poster_path;
                    jsonObject.data[i].backdropPath = BACKDROP_BASE_PATH + arrTempStore[i].results[j].backdrop_path;
                    break;
                }
            }
        }
        if(i == arrTempStore.length){
            writefile();
        }
    }


    function writefile() {
        fs.writeFile('imdb250.json', JSON.stringify(jsonObject, null, 4), function (err) {

            console.log("File written");
        })
    }

});