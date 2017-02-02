movieModel = require("../models/movie").movieModel;

movieModel.update( { },
    { $set:{comments: []}},
    function(err,deleted){
      if(err) {
          console.log("error: " +err.body)
      }else{
         console.log("Deleted all comments for all")
      }
})
