exports.timeSimpleFormat =  function(comment){

    var ctNum = Number(comment.time);
    var time = Date.now();
    var elapsedmilli = time - ctNum;
    var elapsedSec = elapsedmilli/1000;

    if(elapsedSec < 60){
        return Math.floor(elapsedSec) + "sec ago";
    }
    var elapsedMin = elapsedSec/60;
    if(elapsedMin < 60) {
        return Math.floor(elapsedMin) + "min ago";
    }
    var elapsedHour = elapsedMin/60;
    if(elapsedHour < 24) {
        return Math.floor(elapsedHour) + "hr ago";
    }
    var elapsedDays = elapsedHour/24;
    if(elapsedDays < 7){
        return Math.floor(elapsedHour) + "day ago";
    }
    else {
        var today = new Date();
        var year = today.getFullYear();
        var commentDate;
        if (comment.dateInSimpleFormat) {
            commentDate = comment.dateInSimpleFormat.split(",");
            var thenYear = Number(commentDate[2]);
            console.log(year);
            console.log(thenYear);
            if (year == thenYear) {
                return commentDate[0] + " " + commentDate[1];
            }
            else {
                return commentDate;
            }
        }
    }
    }