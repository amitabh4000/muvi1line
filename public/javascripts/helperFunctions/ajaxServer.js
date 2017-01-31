function sendToServer1() {
    var path = "http://127.0.0.1:8080/IMDB250/ajax"
    comment = $("#comment-post").val();
    console.log("Comment posted is: " + comment);
    var movieId = JSON.stringify(movieId)
    console.log("movie id is: "+movieId);

    $.ajax({
        url: path,
        type: "POST",
        dataType: "json",
        data: JSON.stringify({"comment": comment,"movieId":movieId}),
        contentType: "application/json",
        cache: false,
        async: false,
        timeout: 500,
        complete: function () {
            //called when complete
            console.log('process complete');
        },

        success: function (comment) {
            console.log(comment);
            console.log('process sucess');
        },

        error: function () {
            console.log('process error');
        },
    });

}
