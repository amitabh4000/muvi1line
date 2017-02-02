 exports.simpleDateFormat = function(){
     var today = new Date();
     var dd = today.getDate();
     var mm = today.getMonth();
     var year = today.getFullYear();
     var months = ["Jan" ,"Feb","Mar", "Apr",
                         "May","Jun","Jul","Aug",
                         "Sep","Oct","Nov","Dec"];
     var res = months[mm] + "," + dd + "," +year;
     console.log("Inside simple date "+res);
     return res;
 }