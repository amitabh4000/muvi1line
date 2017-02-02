function AjaxCommunicate(path,comment,movie) {
    $.ajax({
        url: path,
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({"comment": comment,"movieId":movie}),
        cache: false,
        async: false,
        timeout: 500,
        complete: function () {
            //called when complete
            console.log('process complete');
            setTimeout(function(){location.reload();},200);
        },

        success: function (response) {
        },

        error: function () {
            console.log('process error');
        },
    });

}
